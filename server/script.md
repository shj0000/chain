# ddd

### nuhup
* `nohup yarn start &`
* `&` 필요여부 검색

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
