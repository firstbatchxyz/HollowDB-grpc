import { lightClient } from "./client.js";

const pool = ["INSERT YOUR GRPC SERVER URLS HERE"];

let client = new lightClient({
  pool: pool,
  timeout: 22000,
  write_deadline: 10000,
  read_deadline: 5000,
});

export const handler = async (event, context, callback) => {
  if (event.request === "get") {
    return await client.get(event.key).then();
  } else if (event.request === "put") {
    return client.put(event.key, event.data);
  } else if (event.request === "update") {
    return client.update(event.key, event.data, event.proof);
  } else if (event.request === "remove") {
    return client.remove(event.key, event.proof);
  }
};
