# ddd

### nohup
* `nohup yarn start &`
* `&` 필요여부 검색

### screen
* nuhub 대체해서 screen 내에서 `yarn start` 실행 -> 로그 보존 등. 재기동 및 종료 등 유지보수 쉬움.

## shell script
```sh

#!/bin/bash

cd /home/ganaab0000/chain
git pull >> /home/ganaab0000/schedule_log.out
echo "$(tail -1000 /home/ganaab0000/schedule_log.out)" > /home/ganaab0000/schedule_log.out

sleep 20s

cd /home/ganaab0000/chain
git pull >> /home/ganaab0000/schedule_log.out
echo "$(tail -1000 /home/ganaab0000/schedule_log.out)" > /home/ganaab0000/schedule_log.out

sleep 20s

cd /home/ganaab0000/chain
git pull >> /home/ganaab0000/schedule_log.out
echo "$(tail -1000 /home/ganaab0000/schedule_log.out)" > /home/ganaab0000/schedule_log.out

```

## crontab
```txt
* * * * * /home/ganaab0000/schedule.sh

```
