"use strict";

import { encode } from "./utils/encoder.js";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import { fileURLToPath } from "url";
import pTimeout from "p-timeout";

export class lightClient {
  constructor(opt) {
    this.pool = opt.pool;
    this.timeout = opt.timeout;
    this.write_deadline = opt.write_deadline;
    this.read_deadline = opt.read_deadline;

    const options = {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    };

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const protoPath = path.join(__dirname, "../protos/hollow.proto");

    let packageDefinition = protoLoader.loadSync(protoPath, options);
    this.DB = grpc.loadPackageDefinition(packageDefinition).hollowdb.DB;
  }

  async #doWrite(opt) {
    let that = this;
    return new Promise(async function (resolve, reject) {
      let pool = [...that.pool];
      let resolved = false;
      while (!resolved) {
        if (pool.length == 0) pool = [...that.pool]; //reset the pool if its empty

        const selector = Math.floor(Math.random() * pool.length);
        const url = pool.splice(selector, 1)[0];
        console.log("trying the url: ", url);
        const client = new that.DB(url, grpc.credentials.createInsecure());

        try {
          const response = await that.#writePromise(client, opt);
          resolve(response);
          if (response.hasOwnProperty("result")) resolved = true; //if the response has result property, then we are done
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  async #doRead(key) {
    let that = this;
    return new Promise(async function (resolve, reject) {
      let pool = [...that.pool];
      let resolved = false;
      while (!resolved) {
        if (pool.length == 0) pool = [...that.pool]; //reset the pool if its empty

        const selector = Math.floor(Math.random() * pool.length);
        const url = pool.splice(selector, 1)[0];
        console.log("trying the url: ", url);
        const client = new that.DB(url, grpc.credentials.createInsecure());

        try {
          const response = await that.#readPromise(client, key);
          resolve(response);
          if (response.hasOwnProperty("data")) resolved = true; //if the response has data property, then we are done
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  async #writePromise(client, opt) {
    return new Promise((resolve, reject) => {
      client.write(
        {
          method: opt.method,
          key: opt.key,
          data: opt.data == null ? null : encode(opt.data),
          proof: opt.proof == null ? null : encode(opt.proof),
        },
        { deadline: Date.now() + this.write_deadline },
        (error, response) => {
          if (error) reject(error);
          resolve(response);
        }
      );
    });
  }

  async #readPromise(client, key) {
    return new Promise((resolve, reject) => {
      client.read(
        {
          key: key,
        },
        { deadline: Date.now() + this.read_deadline },
        (error, response) => {
          if (error) reject(error);
          resolve(response);
        }
      );
    });
  }

  async get(key) {
    return await pTimeout(this.#doRead(key), {
      milliseconds: this.timeout,
      message:
        "lambda:get timeout error (do not confuse this with deadline_exceeded) ",
    });
  }

  async put(key, data) {
    return await pTimeout(
      this.#doWrite({
        key: key,
        data: data,
        method: "put",
        proof: null,
      }),
      {
        milliseconds: this.timeout,
        message:
          "lambda:put timeout error (do not confuse this with deadline_exceeded) ",
      }
    );
  }

  async update(key, data, proof) {
    return await pTimeout(
      this.#doWrite({
        key: key,
        data: data,
        method: "update",
        proof: proof,
      }),
      {
        milliseconds: this.timeout,
        message:
          "lambda:update timeout error (do not confuse this with deadline_exceeded) ",
      }
    );
  }

  async remove(key, proof) {
    return await pTimeout(
      this.#doWrite({
        key: key,
        data: null,
        method: "remove",
        proof: proof,
      }),
      {
        milliseconds: this.timeout,
        message:
          "lambda:remove timeout error (do not confuse this with deadline_exceeded) ",
      }
    );
  }
}

//exports.lightClient = lightClient;
