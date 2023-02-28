const { SDK } = require("project-afael-hlw");
const { jwk, contractTxId } = require("./util/config.js");
const { createClient } = require("redis");

const redisPort =
  "redis://redis-server:6379";

async function main() {
  const redisClient = createClient({
    url: redisPort,
  });
  await redisClient.connect();

  const db = new SDK(jwk, contractTxId, redisClient);

  const result = await db.get("61b0ead0-b257-4bb3-8a3a-180766ad7751");
  console.log("-------------->GET RESULT: ", result);

  await redisClient.disconnect();
}

main();
