#!/bin/bash

cd ~

git clone https://github.com/shj0000/chain.git

cd chain/

ls -alF

git checkout dev

cd docs

bash test.sh
