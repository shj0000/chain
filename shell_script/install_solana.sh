#!/bin/sh

# path
cd ~

# install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# install solana
sh -c "$(curl -sSfL https://release.solana.com/v1.9.6/install)"

# check
solana --version

# libudev-devel on Redhat-derived
