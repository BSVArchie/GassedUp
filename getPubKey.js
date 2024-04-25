// run this with `node getPubKey.js`

const bsv = require("bsv");

const privateKey = new bsv.PrivateKey(
  "YOUR-PRIVATE-KEY-GOES-HERE"
);

const publicKey = privateKey.publicKey;

console.log("Public Key:", publicKey.toString());
