const { spawn } = require("child_process");
const express = require('express');
const app = express();
const port = 3000;


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

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/test', (req, res) => {
  res.send('Hello World!');
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

