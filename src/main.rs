use openssl::bn::BigNum;
use openssl::rsa::Rsa;
use serde::Serialize;
use sha2::{Digest, Sha256};
use std::fs;
use std::sync::Arc;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use threadpool::ThreadPool;

macro_rules! safe_encode {
    ($e: expr) => {
        base64::encode_config($e, base64::URL_SAFE)
    };
}

#[derive(Debug, Serialize)]
struct Key {
    kty: String,
    n: String,
    e: String,
    d: String,
}

fn main() {
    let dir: u128 = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_millis();

    fs::create_dir(format!("wallets/{}", dir)).expect("Failed to create directory.");

    let n_workers = 20;
    let pool = ThreadPool::new(n_workers);
    // Shared thread state to check if ideal phrase was found or not.
    // Not using bool because it doesn't impelement Copy trait.
    let done = Arc::new(Mutex::new(0));

    // Apparently, `threadpool` crate does not limit the amount of queued workers. This cause huge amount of memory allocation and the OS eventually kills the process. Thus, we need to maintain a limit of queued thread counter.
    let curr_threads = Arc::new(Mutex::new(0));

    loop {
        if *curr_threads.lock().unwrap() >= 20 {
            continue;
        }
        if *done.lock().unwrap() == 1 {
            break;
        }
        let mut threads = curr_threads.lock().unwrap();
        *threads += 1;
        println!("{} {}", "Filling thread...", threads);
        let threads = Arc::clone(&curr_threads);
        let data = Arc::clone(&done);

        pool.execute(move || {
            let exponent = BigNum::from_u32(65537).unwrap();
            let key = Rsa::generate_with_e(4096, &exponent).unwrap();
            let n = key.n().to_vec();
            let jwk = Key {
                kty: "RSA".to_string(),
                n: safe_encode!(n.clone()),
                e: safe_encode!(key.e().to_vec()),
                d: safe_encode!(key.d().to_vec()),
            };
            let mut hasher = Sha256::new();
            hasher.update(n);
            let address = safe_encode!(&hasher.finalize()[..]);
            if address.starts_with("divy") {
                // REPLACE ME with your ideal subphrase.
                let mut data = data.lock().unwrap();
                *data = 1;
                println!("Found! {}", &address);
            }
            let jwk = serde_json::to_vec(&jwk).expect("Failed to serialize wallet.");
            let mut curr_threads = threads.lock().unwrap();
            fs::write(
                format!("wallets/{}/addr_{}.txt", dir, *curr_threads),
                address,
            )
            .expect("Unable to address to file");
            fs::write(
                format!("wallets/{}/wallet_{}.json", dir, *curr_threads),
                jwk,
            )
            .expect("Unable to jwk to file");
            println!("{} Active: {}", "Closing thread...", *curr_threads);
            *curr_threads -= 1;
        });
    }
}
