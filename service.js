const { threadId } = require('worker_threads');
const Arweave = require("arweave");
const fs = require("fs");

const client = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
});

client.wallets.generate().then((keyfile) => {
    // let wallet = await client.wallets.jwkToAddress(keyfile);
    fs.writeFileSync(`wallets/wallet_${threadId}.json`, JSON.stringify(keyfile, null, 4));
});
