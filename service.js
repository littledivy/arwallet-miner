const { parentPort } = require('worker_threads');

let keyfile = await client.wallets.generate();
let wallet = await client.wallets.jwkToAddress(keyfile);

parentPort.postMessage({ wallet });