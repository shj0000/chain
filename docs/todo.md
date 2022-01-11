# 할일 정리
## 우선순위 정리
* api 구현. git repo 주소, 내부 경로 입력시 로그와 Program Id 출력. 등.
* ...
* ...
## 스마트 컨트랙트 개발 단순화
* 일단 최우선순위로.. line by line 으로 git repo 자동 배포 후 로그 기록 & 출력.
* 배포 아이디 기록 & 출력.
* 거기에 플러스 알파로 도커 그리고 IDE 라이브러리 Remix 등 참고. aron, sol ide 등

### 일단 참고 코드 line by line 
```js
var process = require('child_process');

var cmd = process.spawn(command);

cmd.stdout.on('data', function(output){
    console.log(output.toString()):
});

cmd.on('close', function(){
    console.log('Finished');
});

//Error handling
cmd.stderr.on('data', function(err){
    console.log(err);
});

```
