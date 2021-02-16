# Based on https://github.com/useverto/trading-post/blob/master/install/linux.sh
set -e

if [ "$(uname -m)" != "x86_64" ]; then
  echo "Error: Unsupported architecture $(uname -m). Only x64 binaries are available." 1>&2
  exit 1
fi

if ! command -v unzip >/dev/null; then
  echo "Error: unzip is required." 1>&2
  exit 1
fi

if [ $# -eq 0 ]; then
  release_uri="https://github.com/littledivy/arwallet-miner/releases/latest/download/arwallet-miner-x86_64-unknown-linux-gnu.zip"
else
  release_uri="https://github.com/littledivy/arwallet-miner/releases/download/${1}/arwallet-miner-x86_64-unknown-linux-gnu.zip"
fi

install_dir="${ARWALLET_INSTALL:-$HOME/.arwalletminer}"
bin_dir="$install_dir"
exe="$bin_dir"

if [ $ARWALLET_RELEASE_URI ]; then 
  release_uri=$ARWALLET_RELEASE_URI
fi

if [ ! -d "$bin_dir" ]; then
  mkdir -p "$bin_dir"
fi

curl -#L -o "$exe.zip" "$release_uri"
cd "$bin_dir"
unzip -o "$exe.zip"
chmod +x "$exe"
rm "$exe.zip"

echo "Successfully installed arwallet_miner to $exe"
if command -v arwallet_miner >/dev/null; then
  echo "Run 'arwallet_miner --help' to get started"
else
  case $SHELL in
  /bin/zsh) shell_profile=".zshrc" ;;
  *) shell_profile=".bash_profile" ;;
  esac
  echo "Manually add the directory to your \$HOME/$shell_profile (or similar)"
  echo "  export ARWALLET_INSTALL=\"$install_dir\""
  echo "  export PATH=\"\$ARWALLET_INSTALL:\$PATH\""
  echo "Run 'arwallet_miner --help' to get started"
fi