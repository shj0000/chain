# ddd
* 쉘스크립트로 자동 설치 - github url로 실행하도록 구성.
* api 서버도 자동 설치하도록 구성. - git clone, screen 설치, 배포 등..
## ㅇㅇㅇ
* github url 경로만 넣으면, 자동으로 쉘스크립트 실행 후 로그만 출력하도록 하는 게 가장 무난.
* 서버 접속 수정없어도 되고, 유지보수상 쉽고.
* 근데 보안상 치명적이라서, api 서버의 해당 계정에 대한 전권을 가지고 있어서. OTP 연동 권장.
  * 쉘 스크립트 종류
    * solana 환경 구성
    * solana deploy
    * 특정 경로의 Git repo 웹서버 배포
* 입력 폼: IP, API PW, 쉘스크립트 종류, 인자값.
  * 인자값으로 Github 경로등으로 Smart Contract Repo 파악.

* 쉘스크립트 전부를 screen 내에서 실행해서 로그를 남길 수 있을까?

* 쉘스크립트 파일서버는 git repo + path ??
  * 간단한 방법 찾기.
## 참고
* nodejs exec, spawn
  * https://stackabuse.com/executing-shell-commands-with-node-js/
* spawn bash
  * https://stackoverflow.com/questions/28968662/using-a-pipe-character-with-child-process-spawn
* [참고](https://unix.stackexchange.com/questions/162133/run-script-in-a-screen)
```bash
curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -
```

### 스크린 사용방법
* https://unix.stackexchange.com/questions/162133/run-script-in-a-screen
### 파이프 사용방법
* 두 가지
  * 1. 문자열 전달
  * 2. pipe 함수 사용
  * https://stackoverflow.com/questions/38273253/using-two-commands-using-pipe-with-spawn


