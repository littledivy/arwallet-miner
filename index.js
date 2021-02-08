// Adapted from https://github.com/th8ta/wallet-miner/blob/main/src/components/Generate.vue
// MIT License (c) theta.org 

const { Worker } = require('worker_threads');
const Arweave = require('arweave');

let wallet = "";
let phrase = "123";
let keyfile = {};
const phraseInWallet = () => wallet.substring(0, phrase.length);

let n_thread = new Array(20); for (let i=0; i<20; ++i) n_thread[i] = false;
function generateWallet() {
    let i = 0;
    while (phraseInWallet() !== phrase) {
        if(n_thread.includes(false)) {
            n_thread[n_thread.indexOf(false)] = true;
            
            const worker = new Worker('./service.js');
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