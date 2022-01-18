const { spawn } = require("child_process");
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.get('/git/pull', (req, res) => {
  res.send('Hello World!');
});

app.get('/exec/shell_script/test', (req, res) => {
  res.send('Hello World!');
        
  // ls -> process
  const ls = spawn('bash', ['./test.sh']);

  ls.stdout.on("data", data => {
      console.log(`stdout: ${data}`);
  });

  ls.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
  });

  ls.on('error', (error) => {
      console.log(`error: ${error.message}`);
  });

  ls.on("close", code => {
      console.log(`child process exited with code ${code}`);
  });
});

app.get('/exec/shell_script/param', (req, res) => {
  res.send('Hello World!');
        
  const param = {
    path: ""
  };
  
  // ls -> process
  const ls = spawn('bash', ['./test_git.sh']);

  ls.stdout.on("data", data => {
      console.log(`stdout: ${data}`);
  });

  ls.stderr.on("data", data => {
      console.log(`stderr: ${data}`);
  });

  ls.on('error', (error) => {
      console.log(`error: ${error.message}`);
  });

  ls.on("close", code => {
      console.log(`child process exited with code ${code}`);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

