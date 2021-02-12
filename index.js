// Adapted from https://github.com/th8ta/wallet-miner/blob/main/src/components/Generate.vue
// MIT License (c) theta.org 

const { Worker } = require('worker_threads');
const Arweave = require('arweave');
const fs = require("fs");

let phrase = "0"; // HEY! What do you want the ideal wallet address to being with? :D

// Global state...haha..eww
let foundIdeal = false;

// `node index.js <n>` to run using <n> active threads. Defaults to 20.
let n = process.argv[2] || 20;
// Activity state for each thread.
let n_thread = new Array(n); for (let i=0; i<n; ++i) n_thread[i] = false;

// Create a fresh directory for this run.
const dir = new Date().getTime();
fs.mkdirSync(`wallets/${dir}`);

// Call this function and go to sleep.
function mine() {
    // Did one of my child find the ideal key? no? meh...continue
    while (!foundIdeal) {
        // I want all my childs to be constantly working. No rest!
        if(n_thread.includes(false)) {
            n_thread[n_thread.indexOf(false)] = true; // * Wakes up child *
            
            // Child labour.
            const worker = new Worker('./service.js', { workerData: { dir, phrase } });
            console.log(`Spawned thread...${worker.threadId}`);
            worker.on('message', (_) => {
              // WOW! Great job child! I shall now kill you.
              foundIdeal = true;
              console.log("Stopping process. Bye.");
              process.exit(0);
            });
            
            // Oh what?
            worker.on('error', console.error);
            worker.on('messageerror', console.error);
            
            worker.on('exit', () => {
                // Mom, i'm going to sleep.
                console.log(`Closing Thread...${worker.threadId}`);
                // Good night.
                n_thread[n_thread.indexOf(true)] = false;
                mine();
            });   
        } else {
            break
        }
    }
}

// Start my childs.
mine();
