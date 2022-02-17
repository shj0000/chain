#!/bin/sh

# echo "Hello, World! (Git)"
# ...
screen -ls
screen -S screen_session_name_supervisor_server -X quit
screen -ls
screen -dmS screen_session_name_supervisor_server bash -c 'cd ~/chain/rpc_api_server_basic; supervisor ws_server.js'
screen -ls

# 실행(있을 경우)
# screen -r screen_session_name_supervisor_server
