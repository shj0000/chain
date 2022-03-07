
var express = require('express');
var os = require('os');
var app = express();
const cors = require('cors');

const { spawn } = require("child_process");
// import ObjectUtil from "./util/ObjectUtil.js";
// let objectUtil = new ObjectUtil();

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

var opsys = process.platform;
if (opsys == "darwin") {
  opsys = "MacOS";
} else if (opsys == "win32" || opsys == "win64") {
  opsys = "Windows";
} else if (opsys == "linux") {
  opsys = "Linux";
}

const serverInfo = {
  opsys: opsys,
  type: os.type(),
  platform: os.platform(),
  release: os.release(),
}

const SERVER_PORT = 3001;
const OS_SCRIPT_CENT_OS = "./os_script/exec/cent_os/";

let cmdArr;
let cmdSocketMap = {};
// TODO :: window, linux 명령어 구분.
// TODO :: 기본 - Server 시작 시, 자동으로 Client 구성 Shell Script 실행




// let cmdMap = {};

// Usages: Server
// [
//   ["help"],
//   ["set/output/beautify/json"],
//   ["set/server/url"],
//   ["get/server/url"],
//   ["get/server/url2"],
//   ["get/server/url3"],
//   ["get/server/url4"],
//   ["get/aa/bb/cc/dd/ee/ff"],
// ].forEach(v => {
//   objectUtil.createNestedObject(this.cmdMap, v[0].split('/'), () => undefined);

//   app.get(v[0], v[1]);
// });

// // 운영체제
// // 서버 하드웨어, 소프트웨어 등 info

// // os script folder. window. centos, ubuntu.



// apiArr.push(['/', function (req, res) {
//   res.sendFile(__dirname + '/index.html');
// }]);

// localhost:3000으로 서버에 접속하면 클라이언트로 index.html을 전송한다
// app.post('/', function (req, res) {
//   log(req, res);
//   res.sendFile(__dirname + '/index.html');
// });

app.post('/get/cmd', function (req, res) {
  log(req, res);

  return succ(req, res, cmdArr);
});

app.post('/get/server', function (req, res) {
  log(req, res);

  return succ(req, res, serverInfo);
});

app.post('/get/test/query/default', (req, res) => {
  log(req, res);

  const result = {
    req_body: req.body,
    req_params: req.params,
    req_query: req.query,
  };
  return succ(req, res, result);
});

app.post('/get/test/query/format', (req, res) => {
  log(req, res);

  const validationForm = {
    inputBody: {
      col1: "",
      col2: "",
      col3: "",
      col4: "",
    }
  };
  const result = {};

  let isValidatedForm = checkValidationForm(validationForm.inputBody, req.body.inputBody);
  if (isValidatedForm) {
    result["inputBody"] = req.body.inputBody;
  } else {
    result["inputBody"] = validationForm.inputBody;
  }

  return succ(req, res, result);
});

app.post('/exe/git/pull', (req, res) => {
  log(req, res);

  if (opsys != "linux") {
    return err(req, res, "only linux");
  }

  const path = OS_SCRIPT_CENT_OS + 'git_pull.sh';
  return cmd(path, req, res);
});

app.post('/exe/restart/client', (req, res) => {
  log(req, res);

  if (opsys != "linux") {
    return err(req, res, "only linux");
  }

  const path = OS_SCRIPT_CENT_OS + 'screen_reactjs.sh';
  return cmd(path, req, res);
});

app.post('/exe/sock/install/solana', (req, res) => {
  log(req, res);

  if (opsys != "linux") {
    return err(req, res, "only linux");
  }

  const wsPath = OS_SCRIPT_CENT_OS + 'install_solana.sh';
  const validationForm = {
    wsPath: wsPath,
    inputBody: {
      col1: "",
      col2: "",
      col3: "",
      col4: "",
    }
  };
  const result = {};

  let isValidatedForm = checkValidationForm(validationForm.inputBody, req.body.inputBody);
  if (isValidatedForm) {
    result["isExecSocket"] = true;
    result["inputBody"] = req.body.inputBody;
  } else {
    result["inputBody"] = validationForm.inputBody;
  }

  return succ(req, res, result);
});

cmdArr = app
  ._router.stack          // registered routes
  .filter(r => r.route)    // take out all the middleware
  .map(r => r.route.path.slice(1))  // get all the paths
;

function log(req, res, data) {
  var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log(`log : ${fullUrl} : ${data}`);
};

function succ(req, res, data) {
  console.log(`success : ${data}`);
  res.send({ success: true, result: data });
};

function err(req, res, data) {
  console.log(`err : ${data}`);
  res.send({ success: false, data: data });
};

function logSocket(socket, data) {
  console.log(`log : ${data}`);
};

function errSocket(socket, data) {
  console.log(`err : ${data}`);
};

function cmd(path, req, res) {
  const process = spawn('bash', [path]);

  process.stdout.on("data", data => {
    res.send(`stdout: ${data}`);
  });

  process.stderr.on("data", data => {
    res.send(`stderr: ${data}`);
  });

  process.on('error', (error) => {
    res.send(`error: ${error.message}`);
  });

  process.on("close", code => {
    res.send(`child process exited with code ${code}`);
  });
};

function cmdSocket(socket, data, path) {
  const process = spawn('bash', [path]);

  var msg = {
    from: {
      name: socket.name,
      userid: socket.userid
    },
    msg: data.msg
  };

  process.stdout.on("data", data => {
    socket.emit('cmdSocketResult', `stdout: ${data}`);
  });

  process.stderr.on("data", data => {
    socket.emit('cmdSocketResult', `stderr: ${data}`);
  });

  process.on('error', (error) => {
    socket.emit('cmdSocketResult', `error: ${error.message}`);
  });

  process.on("close", code => {
    socket.emit('cmdSocketResult', `child process exited with code ${code}`);
  });
};

function checkValidationForm(validationForm, data) {
  let isValidatedForm = true;
  Object.keys(validationForm).forEach(k => {
    if (typeof data?.[k] == "undefined") {
      isValidatedForm = false;
    }
  });

  return isValidatedForm;
}

// connection event handler
// connection이 수립되면 event handler function의 인자로 socket인 들어온다
io.on('connection', function (socket) {

  // 접속한 클라이언트의 정보가 수신되면
  socket.on('login', function (data) {
    logSocket(socket, 'Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

    // socket에 클라이언트 정보를 저장한다
    socket.name = data.name;
    socket.userid = data.userid;

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    io.emit('login', data.name);
  });

  // 클라이언트로부터의 메시지가 수신되면
  socket.on('cmdSocket', function (data) {
    logSocket(socket, data);

    var msg = {
      from: {
        name: socket.name,
        userid: socket.userid
      },
    };

    var validationForm = {
      wsPath: "",
    }

    let isValidatedForm = checkValidationForm(validationForm, data);
    if (!isValidatedForm) {
      return errSocket(socket, data);
    }

    const wsPath = data.wsPath;
    cmdSocket(socket, data, wsPath);
  });

  // force client disconnect from server
  socket.on('forceDisconnect', function () {
    socket.disconnect();
  })

  socket.on('disconnect', function () {
    logSocket(socket, 'user disconnected: ' + socket.name);
  });
});

server.listen(SERVER_PORT, function () {
  console.log(`Socket IO & HTTP server listening on port ${SERVER_PORT}`);
});