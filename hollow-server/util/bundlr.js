//import Bundlr from "@bundlr-network/client";
const Bundlr = require("@bundlr-network/client");

async function upload(jwk, payload) {
  //TODO: get txID from upload instead of sign
  //TODO: throw error if failed to upload

  const bundlr = new Bundlr.default(
    "http://node1.bundlr.network",
    "arweave",
    jwk
  );

  const tags = [{ name: "Content-Type", value: "application/json" }];
  const transaction = await bundlr.createTransaction(
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

exports.upload = upload;
