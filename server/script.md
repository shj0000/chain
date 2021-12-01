# ddd

## shell script
```sh
  GNU nano 3.2                      schedule.sh                       Modified

#!/bin/bash


cd /home/ganaab0000/chain
git pull >> /home/ganaab0000/schedule_log.out
echo "$(tail -1000 /home/ganaab0000/schedule_log.out)" > /home/ganaab0000/sched$


sleep 20s


cd /home/ganaab0000/chain
git pull >> /home/ganaab0000/schedule_log.out
echo "$(tail -1000 /home/ganaab0000/schedule_log.out)" > /home/ganaab0000/sched$



sleep 20s



cd /home/ganaab0000/chain
git pull >> /home/ganaab0000/schedule_log.out
echo "$(tail -1000 /home/ganaab0000/schedule_log.out)" > /home/ganaab0000/sched$






```

## crontab
```txt
* * * * * /home/ganaab0000/schedule.sh

```
