# HollowDB gRPC Cluster

Arweaves' smart contract system uses _lazy evaluation_ model which takes the burden of the contract evaluation from miners and gives them to contract users. This means that whenever a client wants to interact with the contract they need to fetch the whole contract state from arweave and compute the new state on their own machine.

But what does this mean for hollowdb users?

In order to write a single key, the client needs to fetch all of the database to their local. This proves to be a huge problem for contracts that holds huge amount of data like hollowdb.

gRPC cluster is Hollow's solution to lazy evaluation being a burden to client.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/lazy_dark.svg" width="50%">
  <source media="(prefers-color-scheme: light)" srcset="../assets/lazy_light.svg" width="50%">
  <img alt="gRPC cluster architecture">
</picture>

Cluster essentially is a middleman between the client and the Arweave that holds the exact copy of the contracts' on-chain data in its cache. Thanks to the caching mechanism and the contract KV technology of the warp-contracts a dedicated server can provide web2 like speeds.

## Cluster Architecture

gRPC Cluster consists of three parts.

- number of gRPC nodes
- shared redis cache
- envoy proxy.

<!-- <p align="left">
<img width="50%" src="assets/cluster.svg">
<p/> -->

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/cluster_dark.svg" width="50%">
  <source media="(prefers-color-scheme: light)" srcset="../assets/cluster_light.svg" width="50%">
  <img alt="gRPC cluster architecture">
</picture>

Envoy proxy is the interaction endpoint of the cluster. Requests from multiple clients reach the envoy proxy then, envoy distributes the load across gRPC servers.

Redis Cache is a shared on memory kv database for both warp-contracts cache and contract KV.

gRPC nodes are identical gRPC servers that uses HollowDB underneath. For more info about gRPC please visit the official gRPC [documentation](https://grpc.io/docs/what-is-grpc/introduction/).
