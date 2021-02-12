const { workerData, parentPort, threadId } = require('worker_threads');
const Arweave = require("arweave");
const fs = require("fs");

const client = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
});

client.wallets.generate().then(async (keyfile) => {
    let addr = await client.wallets.jwkToAddress(keyfile);
    fs.writeFileSync(`wallets/${workerData.dir}/wallet_${threadId}.json`, JSON.stringify(keyfile));
    fs.writeFileSync(`wallets/${workerData.dir}/addr_${threadId}.txt`, addr);
    if(addr.startsWith(workerData.phrase)) {
        console.log("Found ideal address!");    
        console.log(`Saved at wallets/${workerData.dir}/addr_${threadId}.txt`);
    	parentPort.postMessage(null);
    }
});
