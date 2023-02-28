const conf = require("./config/env.js");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const health = require("grpc-js-health-check");

const { createClient } = require("redis");
const { WarpFactory } = require("warp-contracts");
const { SDK } = require("hollowdb");
const { jwk, contractTxId } = require("./util/config.js");
const { encode, decode } = require("./util/encoder.js");

const Bundlr = require("@bundlr-network/client");

const path = require("path");

const warp = WarpFactory.forMainnet();

const redisPort = "redis://redis-server:6379";
const redisClient = createClient({
  url: redisPort,
});
redisClient.connect();

const db = new SDK({
  jwk: jwk,
  contractTxId: contractTxId,
  cacheType: "redis",
  warp: warp,
  useContractCache: true,
  useStateCache: true,
  redisClient: redisClient,
});

const bundlr = new Bundlr.default(
  "http://node1.bundlr.network",
  "arweave",
  jwk
);

async function bundlrUpload(payload) {
  const tags = [{ name: "Content-Type", value: "application/json" }];
  const transaction = bundlr.createTransaction(
    JSON.stringify({
      data: payload,
    }),
    {
      tags: tags,
    }
  );

  await transaction.sign();
  const txID = transaction.id;
  await transaction.upload();
  return txID;
}

async function write(call, callback) {
  const input = call.request;
  switch (input.method) {
    case "put":
      try {
        const txID = await bundlrUpload(decode(input.data));
        await db.put(input.key, txID);
        callback(null, { result: "success" });
      } catch (err) {
        callback({
          code: grpc.status.INTERNAL,
          message: `Internal server error (HollowDB): ${err}`,
        });
      }
      break;
    case "update":
      try {
        const txID = await bundlrUpload(decode(input.data));
        await db.update(input.key, txID, decode(input.proof));
        callback(null, { result: "success" });
      } catch (err) {
        callback({
          code: grpc.status.INTERNAL,
          message: `Internal server error (HollowDB): ${err}`,
        });
      }
      break;
    case "remove":
      try {
        await db.remove(input.key, decode(input.proof));
        callback(null, { result: "success", err: null });
      } catch (err) {
        callback({
          code: grpc.status.INTERNAL,
          message: `Internal server error (HollowDB): ${err}`,
        });
      }
      break;
    default:
      callback({
        code: grpc.status.INVALID_ARGUMENT,
        message: `No method supplied or method not recognised: "${input.method}"`,
      });
  }
}

async function read(call, callback) {
  const input = call.request;
  try {
    const result = await db.get(input.key);
    callback(null, {
      data: result,
    });
  } catch (err) {
    callback({
      code: grpc.status.INTERNAL,
      message: `Internal server error (HollowDB): ${err}`,
    });
  }
}

async function main() {
  await db.get(
    "15475709411114797172700875638170970677587558301007289195345465416061940228956"
  );
  const server = new grpc.Server({
    "grpc.max_receive_message_length": 150000,
    //"grpc.max_concurrent_streams": 5
    //"grpc.keepalive_time_ms":50,
    //"grpc.keepalive_timeout_ms":50
    //"grpc-node.max_session_memory": 10
    "grpc-node.max_session_memory": 10000,
    "grpc.max_concurrent_streams": 100,
  });

  let PORT = 9091;
  const PROTO_PATH = path.join(__dirname, "/protos/hollow.proto");

  let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const hollowProto = grpc.loadPackageDefinition(packageDefinition).hollowdb;

  server.addService(hollowProto.DB.service, {
    read: read,
    write: write,
  });

  // By convention, the empty string "" key represents that status of the entire server.
  const statusMap = {
    "": health.servingStatus.SERVING,
    "grpc.test.TestServiceNotServing": health.servingStatus.NOT_SERVING,
    "grpc.test.TestServiceServing": health.servingStatus.SERVING,
  };
  let healthImpl = new health.Implementation(statusMap);
  server.addService(health.service, healthImpl);

  if (process.argv.length >= 3) {
    PORT = parseInt(process.argv[2], 10);
    if (isNaN(PORT) || PORT < 1024 || PORT > 65535) {
      console.log(
        `port ${process.argv[2]} should be integer between 1024-65535`
      );
      process.exit(1);
    }
  }

  console.log(`GRPC HollowDB server binding to port ${PORT}`);
  server.bindAsync(
    `0.0.0.0:${PORT}`,
    grpc.ServerCredentials.createInsecure(),
    function (error, actualPort) {
      if (error) {
        console.log(error);
        return;
      }
      if (actualPort !== PORT) {
        console.log(`Binded to ${actualPort} instead of ${PORT}`);
        return;
      }

      server.start();
      console.log(`GRPC HollowDB server ready`);
    }
  );
}

main();
