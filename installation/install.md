# ddd
* 설치 자동화 쉘스크립트 작성
* api server
* client server - git pull 버튼, ..., web socket result data
* 비번 설정 (OTP ?)
* supervisor 대신 bash pm restart 도 가능.
  * https://engineering.linecorp.com/ko/blog/pm2-nodejs/
```bash
...
방화벽
git 설치
nodejs 설치
sudo npm install supervisor -g
supervisor stream_server.js
(package.json "start"에 supervisor 추가, npm start 명령어로 실행가능)
(api - git pull 시 자동으로 재시작, restart api 필요없음)
```

## screen 설치
## nodejs 설치 & 업그레이드
## supervisor 설치 
## 방화벽 설정
## rpc server 실행
