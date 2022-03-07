import React from "react";
import JSON5 from "json5";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
// import TextareaAutosize from '@mui/base/TextareaAutosize';
import TextField from "@mui/material/TextField";
import io from "socket.io-client"; //모듈 가져오기
import Mousetrap from "mousetrap";
import AceEditor from "react-ace";
// Import a Mode (language)
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/mode-javascript";
// Import a Theme (okadia, github, xcode etc)
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-clouds";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import "ace-builds/src-noconflict/theme-monokai";

import ObjectUtil from "../util/ObjectUtil.js";
let objectUtil = new ObjectUtil();

let serverUrl = "http://localhost:3001/";
let socket = undefined;
// TODO :
// for client용 함수.
// ctrl + H = 단축키 도움말.
// host 주소 출력 및 변경. 등.

// TODO :
// tab으로 치면 url 리스트에서 다음 단어 검색 출력하는 단일 메소드 구현
// enter는 각 메소드에서 구현 상황에 따라 1. 변수 부족 시 디폴트 데이터 출력 혹은 2. 웹 결과 출력 3. 웹소켓 연결 위한 결과 출력
// 3번 케이스일 경우, 연결 시 await를 통해 바로 웹소켓 전송.
// TODO :
// 웹서버 콜백함수로 데코레이터 패턴 로깅 적용.
// ... URL 등. 환경 에 따른 ON/OFF

// TODO
// https://ourcodeworld.com/articles/read/309/top-5-best-code-editor-plugins-written-in-javascript
// input tab issue
// https://gusrb3164.github.io/web/2021/01/07/react-ace/
// Ctrl + H
// 단축키 설명 Modal
// alt + 1,2,3
// 크기 조정 해당 창 제외 한줄 렌더링

class Comp7 extends React.Component {
  constructor(props) {
    super(props);

    this.keyHelpMap = {
      "ctrl+h": "Help",

      "alt+1": "Focus Output",
      "alt+2": "Focus InputBody",
      "alt+3": "Focus Input",

      "enter": "Send(in input)",
      "tab": "Autocomplete(in input)",

      "ctrl+enter": "Send",
    };

    this.cmdHelpMap = {
      client: {
        "cli help": '설명',
      },
      server: {
        "help": '설명',
      },
    };

    this.cmdClientMap = {};
    this.cmdMap = {};
    this.keyForCheckingClient = "off";

    // Usages: Client
    [
      ["clear", () => this.setState({ input: "", inputBody: "{\n\t\n}", output: "" })],
      ["set/client/output/beautify/json", () => this.setState({ 
        input: "", 
        inputBody: "{\n\t\n}", 
        output: this.state.output })],
      ["set/client/server/url", () => this.setServerUrl()],
      ["get/client/server/url", () => this.setState({ input: "", inputBody: "{\n\t\n}", output: serverUrl })],
    ].forEach(v => {
      objectUtil.createNestedObject(this.cmdClientMap, v[0].split('/'), v[1]);
      objectUtil.createNestedObject(this.cmdMap, v[0].split('/'), v[1]);
    });

    this.domOutput = React.createRef();
    this.domInputBody = React.createRef();
    this.domInput = React.createRef();

    this.state = {
      input:
        ``.trim(),
      inputBody: ` {\n\t\n} `.trim(),
      output: "blue",
      isInputFocused: false,
      domOutputHeight: window.innerHeight / 2,
      domInputBodyHeight: window.innerHeight / 2,
      domInputHeight: undefined,
    };

    this.setViewModeOutput = this.setViewModeOutput.bind(this);
    this.setViewModeInputBody = this.setViewModeInputBody.bind(this);
    this.setViewModeInput = this.setViewModeInput.bind(this);

    this.connectSocket = this.connectSocket.bind(this);
  }


  componentDidUpdate() {
    [...document.getElementsByClassName("ace_text-input")].forEach((e) => {
      e.classList.add("mousetrap");
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setViewModeInput);

    let keyList = Object.keys(this.keyHelpMap);

    keyList.forEach((key) => {
      Mousetrap.unbind(key);
    });

    socket?.off("some event");
  }

  componentDidMount() {
    let my = this;
    
    this.connectServer();
    this.connectSocket();

    this.setViewModeInput();
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(this.setViewModeInput, 300, "Resized");
    });

    // textinput 키설정용 클래스 설정.
    [...document.getElementsByClassName("ace_text-input")].forEach((e) => {
      e.classList.add("mousetrap");
    });

    Mousetrap.bind("alt+1", () => {
      this.setViewModeOutput();
      this.focusTextInput(1);
    });

    Mousetrap.bind("alt+2", () => {
      this.setViewModeInputBody();
      this.focusTextInput(2);
    });

    Mousetrap.bind("alt+3", () => {
      this.setViewModeInput();
      this.focusTextInput(3);
    });

    Mousetrap.bind("enter", (e) => {
      if (this.state.isInputFocused) {
        e.preventDefault();
        my.fetchByResultMap();
      }
    });

    Mousetrap.bind("tab", (e) => {
      if (this.state.isInputFocused) {
        e.preventDefault();
        my.fetchTabByResultMap();
      }
    });

    Mousetrap.bind("ctrl+enter", (e) => {
      e.preventDefault();
      my.fetchByResultMap();
    });

    Mousetrap.bind("ctrl+h", (e) => {
      e.preventDefault();
      alert(
        `# 단축키\n${objectUtil.objToStr(this.keyHelpMap)
        }`
        + '\n\n' +
        `# 명령어 (서버)\n${objectUtil.objToStr(this.cmdHelpMap.server)
        }`
        + '\n\n' +
        `# 명령어 (클라이언트)\n${objectUtil.objToStr(this.cmdHelpMap.client)
        }`
      );
    });

  }

  connectServer() {
    // http
    let method = "POST";

    const requestOptions = {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: "{}",
      timeout: 2000,
    };

    let totalUrl = serverUrl + "get/cmd";

    this.setState({ output: `loading...\n ${totalUrl}` });

    console.log("requestOptions", requestOptions);

    fetch(totalUrl, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("fetch worked!");
        console.log("data", data);
        // Usages: Server
        data.result.forEach(v => {
          objectUtil.createNestedObject(this.cmdMap, v.split('/'), () => undefined);
        });
      })
      .catch((err) => {
        console.log("err!!!", err);
        this.setState({ output: JSON5.stringify(err) });
      });
  }

  connectSocket() {
    let my = this;
    socket?.off("some event");
    socket?.disconnect();

    console.log("connect socket: ", serverUrl, socket);
    socket = io(serverUrl, {
      forceNew: true,
      reconnection: false,
    });

    // 서버로 자신의 정보를 전송한다.
    socket.emit("login", {
      // name: "ungmo2",
      name: makeRandomName(),
      userid: "ungmo2@gmail.com",
    });

    // 서버로부터의 메시지가 수신되면
    socket.on("login", function (data) {
      my.setState({ output: JSON5.stringify(data) });
    });

    // 서버로부터의 메시지가 수신되면
    socket.on("cmdSocketResult", function (data) {
      console.log(data);
      my.setState({ output: this.state.output + JSON.stringify(data) + "\n" });
    });

    function makeRandomName() {
      var name = "";
      var possible = "abcdefghijklmnopqrstuvwxyz";
      for (var i = 0; i < 3; i++) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return name;
    }
  }

  setServerUrl() {
    serverUrl = objectUtil.getResultMapByCmd(this.state.input)?.["param"]?.["-url"]?.shift() ?? serverUrl;
    alert(serverUrl);

    this.connectSocket();

    this.setState({ input: "", inputBody: "{\n\t\n}", output: serverUrl });
  }

  fetchTabByResultMap = () => {
    let input = this.state.input;
    let resultMap = objectUtil.getResultMapByCmd(input);
    let isFunction = objectUtil.getIsFunctionInInNestedObj(this.cmdMap, resultMap["url"]);

    // 함수일 경우.
    if (isFunction) {
      this.setState({
        output: "enter(func)",
      });
      return;
    }

    // 다음 후보 출력.
    let haveSpace = input.charAt(input.length - 1) == " ";
    let newUrl = haveSpace
      ? resultMap["url"]
      : resultMap["url-arr"]
        .splice(0, resultMap["url-arr"].length - 1)
        .join('/');

    let candidateKeys = objectUtil.getKeysInNestedObj(this.cmdMap, newUrl);
    let lastWord = input.split(' ').pop();
    let eqArr = candidateKeys.map(e => { if (e.indexOf(lastWord) == 0) return e }).filter(e => !!e);

    this.setState({
      output: JSON5.stringify(eqArr)
    });

    // 유일 존재 시, 자동완성 및 다음 후보 출력.
    if (eqArr.length == 1) {
      let inputArr = this.state.input.trim().split(' ');
      if (!haveSpace) inputArr.pop();
      inputArr.push(eqArr.pop());
      this.setState({
        input: inputArr.join(' ') + ' '
      });
      this.fetchTabByResultMap();
    }
  };

  fetchByResultMap = () => {
    console.log("fetchByResultMap");
    let input = this.state.input;
    let resultMap = objectUtil.getResultMapByCmd(input);



    // if (resultMap["url-arr"][0] == this.keyForCheckingClient) {

    // 분리 예정.
    let isFunction = objectUtil.getIsFunctionInInNestedObj(this.cmdMap, resultMap["url"]);
    if (!isFunction) {
      return this.fetchTabByResultMap();
    }

    let func = objectUtil.getValueInNestedObj(this.cmdClientMap, resultMap["url"]);
    if (typeof func == "function") {
      return func();
    }
    // }

    // http
    let isNeededInputBody =
      Object.keys(JSON5.parse(this.state.inputBody ?? "{}")).length > 0;
    let method = "POST";

    const requestOptions = {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: isNeededInputBody
        ? JSON.stringify({
            inputBody: JSON5.parse(this.state.inputBody)
          })
        : "{}",
      timeout: 2000,
    };

    let searchParams = new URLSearchParams(resultMap.param);
    let totalUrl = serverUrl + resultMap.url + "?" + searchParams;

    this.setState({ output: `loading...\n ${totalUrl}` });

    console.log("requestOptions", requestOptions);

    fetch(totalUrl, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("fetch worked!");
        console.log("data", data);


        this.setState({ output: JSON5.stringify(data, null, "\t") });

        console.log("data.result.inputBody", data?.result?.inputBody);
        if (!!data?.result?.inputBody) {
          this.setState({ inputBody: JSON5.stringify(data.result.inputBody, null, "\t") });
        } else {
          this.setState({ input: "" });
        }

        if (!!data?.result?.isExecSocket) {
          const inputBody = this.state.inputBody;
          socket.emit(data.result.wsPath, { 
            wsPath: data.result.wsPath,
            inputBody: inputBody, 
          });
        }
      })
      .catch((err) => {
        console.log("err!!!", err);
        this.setState({ output: JSON5.stringify(err) });
      });
  };

  setViewModeOutput() {
    let domInputHeight = this.domInput.current?.clientHeight;

    let fullSize = (window.innerHeight - domInputHeight * 2);
    this.setState({
      domOutputHeight: fullSize,
      domInputBodyHeight: domInputHeight,
      domInputHeight: domInputHeight,
    });
  }

  setViewModeInputBody() {
    let domInputHeight = this.domInput.current?.clientHeight;

    let fullSize = (window.innerHeight - domInputHeight * 2);
    this.setState({
      domOutputHeight: domInputHeight,
      domInputBodyHeight: fullSize,
      domInputHeight: domInputHeight,
    });
  }

  setViewModeInput() {
    let domInputHeight = this.domInput.current?.clientHeight;

    let halfSize = (window.innerHeight - domInputHeight) / 2;
    this.setState({
      domOutputHeight: halfSize,
      domInputBodyHeight: halfSize,
      domInputHeight: domInputHeight,
    });
  }

  focusTextInput(id) {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    if (id === 1) {
      this.domOutput.current.editor.textInput.focus();
    }
    if (id === 2) {
      this.domInputBody.current.editor.textInput.focus();
    }
    if (id === 3) {
      this.domInput.current.focus();
    }
  }

  onChangeOutput = (event) => {
    this.setState({ output: event.target.value });
  };

  onChangeInputBody = (newValue) => {
    this.setState({ inputBody: newValue });
  };

  onChangeInput = (event) => {
    this.setState({ input: event.target.value });
  };

  render() {
    return (
      <div>
        <div>
          <AceEditor
            mode="text"
            theme="monokai"
            name="output"
            id="output"
            highlightActiveLine
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false,
              fontSize: "15pt",
            }}
            height={`${this.state.domOutputHeight}px`}
            style={{
              width: "calc(100%)",
            }}
            readOnly
            ref={this.domOutput}
            value={this.state.output}

            wrapEnabled
            showPrintMargin={false}
          />
          <AceEditor
            mode="javascript"
            theme="monokai"
            name="inputBody"
            id="inputBody"
            highlightActiveLine
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false,
              fontSize: "15pt",
            }}
            height={`${this.state.domInputBodyHeight}px`}
            style={{
              width: "calc(100%)"
            }}
            ref={this.domInputBody}
            value={this.state.inputBody}
            onChange={this.onChangeInputBody}

            wrapEnabled
            showPrintMargin={false}
          />
          <ButtonGroup disableElevation variant="contained" fullWidth>
            <TextField
              inputRef={this.domInput}
              inputProps={{ className: "mousetrap" }}
              id="input"
              fullWidth
              value={this.state.input}
              onChange={this.onChangeInput}
              onFocus={() => {
                this.setState({ isInputFocused: true });
              }}
              onBlur={() => {
                this.setState({ isInputFocused: false });
              }}
              autoFocus
            />
            <Button
              variant="contained"
              onClick={this.fetchByResultMap}
              style={{ width: "70px" }}
            >
              tab
            </Button>
            <Button
              variant="contained"
              onClick={this.fetchByResultMap}
              style={{ width: "70px" }}
            >
              send
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

export default Comp7;
