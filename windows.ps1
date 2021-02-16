# Based on https://github.com/useverto/trading-post/blob/master/install/windows.ps1

$ErrorActionPreference = 'Stop'

if ($args.Length -eq 1) {
  $v = $args.Get(0)
}

$ArWalletInstall = $env:ARWALLET_INSTALL
$BinDir = if ($ArWalletInstall) {
  "$ArWalletInstall"
} else {
  "$Home\.arwalletminer"
}

$MinerZip = "$BinDir\arwallet-miner.zip"
$MinerExe = "$BinDir\arwallet_miner.exe"

# GitHub requires TLS 1.2
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$ArWalletUri = if (!$v) {
  "https://github.com/littledivy/arwallet-miner/releases/latest/download/arwallet-miner-x86_64-pc-windows-msvc.zip"
} else {
  "https://github.com/littledivy/arwallet-miner/releases/download/${v}/arwallet-miner-x86_64-pc-windows-msvc.zip
}

if ($env:ARWALLET_RELEASE_URI) {
  $ArWalletUri = $env:ARWALLET_RELEASE_URI
}

if (!(Test-Path $BinDir)) {
  New-Item $BinDir -ItemType Directory | Out-Null
}

Invoke-WebRequest $ArWalletUri -OutFile $MinerZip -UseBasicParsing

if (Get-Command Expand-Archive -ErrorAction SilentlyContinue) {
  Expand-Archive $MinerZip -Destination $BinDir -Force
} else {
  if (Test-Path $MinerExe) {
    Remove-Item $MinerExe
  }
  Add-Type -AssemblyName System.IO.Compression.FileSystem
  [IO.Compression.ZipFile]::ExtractToDirectory($MinerZip, $BinDir)
}

Remove-Item $MinerZip

$User = [EnvironmentVariableTarget]::User
$Path = [Environment]::GetEnvironmentVariable('Path', $User)
if (!(";$Path;".ToLower() -like "*;$BinDir;*".ToLower())) {
  [Environment]::SetEnvironmentVariable('Path', "$Path;$BinDir", $User)
  $Env:Path += ";$BinDir"
}

Write-Output "Successfully installed arwallet_miner to $MinerExe"
Write-Output "Run 'arwallet_miner --help' to get started"
