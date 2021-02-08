// Adapted from https://github.com/th8ta/wallet-miner/blob/main/src/components/Generate.vue
// MIT License (c) theta.org 

const { Worker } = require('worker_threads');
const Arweave = require('arweave');

const client = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
});

let wallet = "";
let phrase = "123";
let keyfile = {};

const phraseInWallet = () => wallet.substring(0, phrase.length);

function generateWallet() {
    let i = 0;
    while (phraseInWallet() !== phrase) {
        const worker = new Worker('./service.js');
        worker.on('message', ({ wallet }) => {
            fs.writeFile(`wallet_${i}.json`, wallet);
        });
        i++;
    }
}

generateWallet();