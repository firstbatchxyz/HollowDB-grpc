# HollowDB gRPC Cluster

HollowDB cluster is a middleman between the warp-contracts and the hollowdb clients which takes the burden of contract evaulation from the client and gives them to a dedicated server in order to catch web2 like performance.

For more information about the cluster please check this [link](/docs/cluster.md).

## Setting up the Cluster

Download the repo

```bash
git clone https://github.com/firstbatchxyz/HollowDB-grpc.git
```

Edit the `hollow-server/utils/config.js` and give your contract txID and JWK.

```js
const contractTxId = "your contract txID";

const jwk = {
  kty: "RSA",
  n: "o8ss...",
  .
  .
};

exports.contractTxId = contractTxId;
exports.jwk = jwk;
```

After that use docker compose to start the cluster

```bash
docker-compose up -d
```

## gRPC Client

As for now there is no dedicated hollowdb client package. You can create your own gRPC client using example-client.

> Dedicated web and nodejs hollowdb client packages are in active development.

## Setting up the Example Client

There is an example aws lambda client in the repo. This client adopts the thick grpc client approach, which makes its own load balancing if there are multiple clusters, example client also retry the connections and has a timeout mechanic.

After gRPC cluster is up get the IP of the server and insert the IP address string to `example-client/index.js`

```js
import { lightClient } from "./client.js";

const pool = ["xx.xx.xx.xx:3000"]; //your clusters IP address

let client = new lightClient({
  pool: pool,
  timeout: 22000, //lambda server will timeout after 22s of retrying
  write_deadline: 10000, //single write operation timeout after 10s, client retries another cluster
  read_deadline: 5000, //single read operation timeout after 5s, client retries another cluster
});
```
