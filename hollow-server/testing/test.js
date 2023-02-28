import grpc from "k6/net/grpc";
import { check, fail, sleep } from "k6";
//import { Trend, Rate, Counter, Gauge } from "k6/metrics";

//import { generateCommitment } from "./helpers/utils.js";

import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

const client = new grpc.Client();
client.load(["../protos"], "hollow.proto");

const sampleJSON = JSON.parse(open("./sample.json"));

//export const RateContentOK = new Rate("Content OK");

export const options = {
  stages: [
    { duration: "1m", target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 30 seconds.
    { duration: "1m", target: 100 }, // stay at 100 users for 1 minutes
    { duration: "30s", target: 0 }, // ramp-down to 0 users in 30 seconds
  ],
};

export default () => {
  //const url = "54.159.167.19:3000";
  const url = "0.0.0.0:8080";
  client.connect(url, {
    plaintext: true,
    timeout: "180s",
  });

  const key = uuidv4();
  console.log("user key: ", key);
  const WriteRequest = {
    method: "put",
    key: key,
    data: sampleJSON,
  };

  const writeRespone = client.invoke("hollowdb.DB/write", WriteRequest, {
    timeout: "5s",
  });

  //test the status code and abort the process of this VU if its not OK
  if (
    !check(writeRespone, {
      "Write status is OK": (r) => r && r.status === grpc.StatusOK,
    })
  ) {
    fail(
      "WriteRequest failed with status code: " +
        writeRespone.status +
        "\n Error: \n" +
        JSON.stringify(writeRespone.error.message)
    );
  }

  console.log(writeRespone.message.result);
  //client.close();

  console.log("Finished writing now sleeping.. \n");
  sleep(10);

  // client.connect(url, {
  //   plaintext: true,
  //   timeout: "180s",
  // });

  const readResponse = client.invoke(
    "hollowdb.DB/read",
    {
      key: key,
    },
    {
      timeout: "5s",
    }
  );

  //test the status code and abort the process of this VU if its not OK
  if (
    !check(readResponse, {
      "Read status is OK": (r) => r && r.status === grpc.StatusOK,
    })
  ) {
    fail(
      "ReadRequest failed with status code: " +
        readResponse.status +
        "\n Error: \n" +
        JSON.stringify(readResponse.error.message)
    );
  }

  client.close();
  console.log("Finished writing sleeping for 100ms.. \n");
  sleep(1);
};
