# Bundlr

If you are new to the Arweave ecosystem the term 'bundlr' may create some confusion. In the javascript world bundler means a piece of software that bundles the javascript code for production. Arweave bundlr does not bundle js code, it bundles your transaction and stores it until it is written to Arweave while making your transaction accassable from internet. This is immensely important because transactions on Arweave blockchain can take hours!

This is why bundlr is one of the core technologies of the Arweave ecosystem along with the warp-contracts. And if you are new to the Arweave ecosystem you better start learning [bundlr](https://bundlr.network/).

## gRPC Cluster and Bundlr

gRPC cluster uses bundlr under the hood to upload the client data to arweave. That way only the transaction id (receipt of the bundlr upload transaction) is stored in the contract which consequently reduces the total contract size and more importantly it allows clients to store data bigger than 2kb (this is the current max transaction data size set by warp contracts by March 2023). Since the gRPC cluster signs and uploads the client data via bundlr and not the client itself, hollowdb-grpc offers gasless experience for clients.

Below is the simplified flow of a "put" operation.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="../assets/bundlr_dark.svg" width="60%">
  <source media="(prefers-color-scheme: light)" srcset="../assets/bundlr_light.svg" width="60%">
  <img alt="bundlr upload flow">
</picture>

## Funding the Bundlr Node

Before uploading data using bundlr you need to fund the bundlr-node using one of the cryptocurrencies bundlr supports. In this example we will use AR the native token of Arweave to fund the bundlr.

Before starting please make sure you have the following ready, an arweave wallet with some amount of AR token in it. Your arweave wallet address, and your privite key file.

### First download the bundlr-cli

```bash
yarn global add @bundlr-network/client
```

### Make sure the installation works. Below command should output the help message,

```
bundlr help
```

> If you are getting no command found errors it is because the `yarn` package manager is not on the path. You can add yarn to path or you can go to the `~/.yarn/bin` directory and use the bundlr binary directly from there.

### Fund the bundlr

Bundlr uses 'atomic' units while funding. 1 AR = 1.000.000.000.000 Winston (atomic units).

```bash
bundlr fund 1000000 -h https://node1.bundlr.network -w path/to/wallet.json -c arweave
```

> keep in mind that arweave network is slow, it can take upwards of 40 minutes before the balance shows up.

### Check the bundlr fund

```bash
bundlr balance <your wallet address> --host https://node1.bundlr.network -c arweave
```
