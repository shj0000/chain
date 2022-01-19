const { spawn } = require("child_process");
const express = require('express');
const app = express();
const port = 3000;

// shell script - screen - reactjs rpc client - restart.

app.get('/', (req, res) => {
  console.log('Log - Hello World!');
  res.send('Hello World!');
});

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.get('/test/io', (req, res) => {
  // in - body param
  // out - websock 
  
  res.send('Hello World!');
});

app.get('/exec/shell_s/screen/reactjs', (req, res) => {
  res.send('Hello World!');
});

app.get('/exit/shell_s/screen/reactjs', (req, res) => {
  res.send('Hello World!');
});

app.get('/restart', (req, res) => {
  console.log('Hello World! Restart!');
  var spawn = require('child_process').spawn;

  (function main() {

    if (process.env.process_restarting) {
      delete process.env.process_restarting;
      // Give old process one second to shut down before continuing ...
      setTimeout(main, 1000);
      return;
    }

    // ...

    // Restart process ...
    spawn(process.argv[0], process.argv.slice(1), {
      env: { process_restarting: 1 },
      stdio: 'ignore'
    }).unref();
  })();
});

app.get('/git/pull', (req, res) => {
  res.send('Hello World!');
  const path = '../shell_script/git_pull.sh';
  cmd(path);
});

// server restart

app.get('/exec/shell_script/test', (req, res) => {
  res.send('Hello World!');
  const path = '../shell_script/test.sh';
  cmd(path);
});

app.get('/exec/shell_script/param', (req, res) => {
  res.send('Hello World!');
        
  const param = {
    path: ""
  };
  
  const path = '../shell_script/test_git.sh';
  cmd(path);
  
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});


function cmd(path) {
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
