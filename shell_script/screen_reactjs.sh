#!/bin/sh

# echo "Hello, World! (Git)"
# ...
screen -ls
screen -S screen_session_name -X quit
screen -ls
screen -dmS screen_session_name bash -c 'cd ~/chain/rpc_api_client_basic/rpc-react; npm install; npm start'
screen -ls

# 실행(있을 경우)
# screen -r screen_session_name
