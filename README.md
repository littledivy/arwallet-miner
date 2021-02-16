# arwallet-miner

Multi-threaded [Arweave](https://arweave.org) wallet miner. Built on top of [OpenSSL](https://github.com/sfackler/rust-openssl) and [threadpool](https://github.com/rust-threadpool/rust-threadpool).

![](https://i.imgur.com/HfyFzBZ.png)

## Installation

Use the [installers](linux.sh) to install the CLI.

### Linux

```bash
curl -fsSL https://arwallet.divy.work/linux.sh | sh
```

### MacOS

```bash
curl -fsSL https://arwallet.divy.work/macos.sh | sh
```

### Windows 

```pwsh
iwr https://arwallet.divy.work/windows.ps1 | iex
```

## Usage

```shell
arwallet_miner -t <THREADS> <PHRASE>

THREADS [default: 20] - Number of threads to queue at a time.
PHRASE - Ideal para phrase to find in the wallet.
```

Example:

Run 20 threads queued at a time with the aim of finding the text `divy` in the wallet address.
```shell
arwallet_miner -t 20 divy
```

## Development

### Prerequisite

* [`openssl`](https://www.openssl.org/) - 
* [`rustc`](https://rust-lang.org) & `cargo`

### Building from source

```shell
cargo build --release
```

> If you get compiler errors about missing OpenSSL installation. Please read the instruction given in the `rust-openssl` repo.

## License
[MIT](https://choosealicense.com/licenses/mit/)