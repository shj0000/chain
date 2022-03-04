const { spawn } = require("child_process");

var express = require('express');
var app = express();
const cors = require('cors');

import ObjectUtil from "./util/ObjectUtil.js";
let objectUtil = new ObjectUtil();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


let corsOptions = {
  origin: '*',
  credentials: true
}

app.use(cors(corsOptions));

var server = require('http').createServer(app);
// http server를 socket.io server로 upgrade한다
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

// TODO :: window, linux 명령어 구분.
// TODO :: 기본 - Server 시작 시, 자동으로 Client 구성 Shell Script 실행




this.cmdMap = {};
// Usages: Server
[
  ["help"],
  ["set/output/beautify/json"],
  ["set/server/url"],
  ["get/server/url"],
  ["get/server/url2"],
  ["get/server/url3"],
  ["get/server/url4"],
  ["get/aa/bb/cc/dd/ee/ff"],
].forEach(v => {
  objectUtil.createNestedObject(this.cmdMap, v[0].split('/'), () => undefined);
});

// 운영체제
// 서버 하드웨어, 소프트웨어 등 info

// os script folder. window. centos, ubuntu.


// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});






app.get('/help', (req, res) => {
  const cmdMap = {
    test1: 'test1ab',
    test2: 'test2ab',
  };
  const resMap = {
    ...cmdMap,
    cmdMap,
    req_body: req.body,
    req_params: req.params,
    req_query: req.query,
  };
  res.send(resMap);
});

app.post('/help', (req, res) => {
  console.log('post : /help');
  const cmdMap = {
    test1: 'test1abc',
    test2: 'test2abc',
  };

  const resMap = {
    ...cmdMap,
    cmdMap,
    req_body: req.body,
    req_params: req.params,
    req_query: req.query,
  };

  resMap["isExecWs"] = true;
  resMap["isPrintDefaultData"] = true;

  if (!!!req.body || !!!req.body.data) {
    resMap["defaultMap"] = { test: 'test' }
  }

  res.send(resMap);
});



app.get('/git/pull', (req, res) => {
  let resMap = {
    url: '/git/pull',
    data: '',
  }
  res.send(resMap);
  const path = '../shell_script/git_pull.sh';
  cmdSimple(path);
});

app.get('/restart/client', (req, res) => {
  res.send('/restart/client');
  console.log('React server listening on port 3000');
  const path = '../shell_script/screen_reactjs.sh';
  cmdSimple(path);
});

app.get('/restart/server', (req, res) => {
  res.send('/restart/server');
});

// connection event handler
// connection이 수립되면 event handler function의 인자로 socket인 들어온다
io.on('connection', function (socket) {

  // 접속한 클라이언트의 정보가 수신되면
  socket.on('login', function (data) {
    console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

    // socket에 클라이언트 정보를 저장한다
    socket.name = data.name;
    socket.userid = data.userid;

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    io.emit('login', data.name);
  });

  // 클라이언트로부터의 메시지가 수신되면
  socket.on('chat', function (data) {
    console.log('Message from %s: %s', socket.name, data.msg);

    var msg = {
      from: {
        name: socket.name,
        userid: socket.userid
      },
      msg: data.msg
    };

    // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
    // socket.broadcast.emit('chat', msg);

    // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
    // socket.emit('s2c chat', msg);
    socket.emit('chat', msg);

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    // io.emit('s2c chat', msg);
    // io.emit('chat', msg);

    // 특정 클라이언트에게만 메시지를 전송한다
    // io.to(id).emit('s2c chat', data);
  });

  // 클라이언트로부터의 메시지가 수신되면
  socket.on('help', function (data) {
    console.log('Message from %s: %s', socket.name, data);

    io.emit('chat', data);
  });

  // 클라이언트로부터의 메시지가 수신되면
  socket.on('cmd', function (data) {
    console.log('Message from %s: %s', socket.name, data.msg);

    const path = '../shell_script/test.sh';
    cmd(socket, data, path);

    // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
    // socket.broadcast.emit('chat', msg);

    // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
    // socket.emit('s2c chat', msg);
    // socket.emit('chat', msg);

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    // io.emit('s2c chat', msg);
    // io.emit('chat', msg);

    // 특정 클라이언트에게만 메시지를 전송한다
    // io.to(id).emit('s2c chat', data);
  });


  // force client disconnect from server
  socket.on('forceDisconnect', function () {
    socket.disconnect();
  })

  socket.on('disconnect', function () {
    console.log('user disconnected: ' + socket.name);
  });
});

server.listen(3001, function () {
  console.log('Socket IO & HTTP server listening on port 3001');
  console.log('React server listening on port 3000');
  const path = '../shell_script/screen_reactjs.sh';
  cmdSimple(path);
});


function cmd(socket, data, path) {
  const process = spawn('bash', [path]);

  var msg = {
    from: {
      name: socket.name,
      userid: socket.userid
    },
    msg: data.msg
  };

  process.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
    socket.emit('chat', `stdout: ${data}`);
  });

  process.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
    socket.emit('chat', `stderr: ${data}`);
  });

  process.on('error', (error) => {
    console.log(`error: ${error.message}`);
    socket.emit('chat', `error: ${error.message}`);
  });

  process.on("close", code => {
    console.log(`child process exited with code ${code}`);
    socket.emit('chat', `child process exited with code ${code}`);
  });
};

function cmdSimple(path) {
  const process = spawn('bash', [path]);

  process.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
  });

  process.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
  });

  process.on('error', (error) => {
    console.log(`error: ${error.message}`);
  });

  process.on("close", code => {
    console.log(`child process exited with code ${code}`);
  });
};