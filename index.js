// Adapted from https://github.com/th8ta/wallet-miner/blob/main/src/components/Generate.vue
// MIT License (c) theta.org 

const { Worker } = require('worker_threads');
const Arweave = require('arweave');
const fs = require("fs");

let wallet = "";
let phrase = "123";
let keyfile = {};
const phraseInWallet = () => wallet.substring(0, phrase.length);

// `node index.js <n>` to run using <n> active threads. Defaults to 20.
let n = process.argv[2] || 20;
// Activity state for each thread.
let n_thread = new Array(n); for (let i=0; i<n; ++i) n_thread[i] = false;

const dir = new Date().getTime();
fs.mkdirSync(`wallets/${dir}`);

function generateWallet() {
    let i = 0;
    while (phraseInWallet() !== phrase) {
        if(n_thread.includes(false)) {
            n_thread[n_thread.indexOf(false)] = true;
            
            const worker = new Worker('./service.js', { workerData: { dir } });
            console.log(`Spawned thread...${worker.threadId}`);
            i++;
            worker.on('error', console.error);
            worker.on('messageerror', console.error);
            worker.on('exit', () => {
                console.log(`Closing Thread...${worker.threadId}`);
                n_thread[n_thread.indexOf(true)] = false;
                generateWallet();
            });   
        } else {
            break
        }
    }
}

generateWallet();
