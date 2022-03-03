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
import "ace-builds/src-noconflict/mode-javascript";
// Import a Theme (okadia, github, xcode etc)
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-github";

const socketUrl = "http://192.168.110.88:10011/";
const socket = io(socketUrl); //3001번 포트 사용(서버)

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

    this.keyMap = {
      "ctrl+h": "Help",

      "alt+1": "Focus Output",
      "alt+2": "Focus InputBody",
      "alt+3": "Focus Input",

      "enter": "Send(in input)",
      "tab": "Autocomplet(in input)",

      "ctrl+enter": "Send",
    };

    this.cmdMap = {
      client: {
        "cli help": '설명',
      },
      server: {
        "help": '설명',
      },
    };

    this.domOutput = React.createRef();
    this.domInputBody = React.createRef();
    this.domInput = React.createRef();

    this.state = {
      input:
        ` git   pull   -d a d  -d 'dfad' -w "dafadf" -df adfwd --dfef 'dff'   'text' "text" text 'text' "text"  `.trim(),
      inputBody: ` {\n\n} `.trim(),
      output: "blue",
      isInputFocused: false,
      domOutputHeight: undefined,
      domInputBodyHeight: undefined,
      domInputHeight: undefined,
    };

    this.setViewModeOutput = this.setViewModeOutput.bind(this);
    this.setViewModeInputBody = this.setViewModeInputBody.bind(this);
    this.setViewModeInput = this.setViewModeInput.bind(this);
  }

  componentDidUpdate() {
    [...document.getElementsByClassName("ace_text-input")].forEach((e) => {
      e.classList.add("mousetrap");
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setViewModeInput);

    let keyList = Object.keys(this.keyMap);

    keyList.forEach((key) => {
      Mousetrap.unbind(key);
    });

    socket.off("some event");
  }

  componentDidMount() {
    let my = this;

    this.setViewModeInput();
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(this.setViewModeInput, 200, "Resized");
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
      if (this.state.isInputFocused) my.fetchByResultMap();
    });

    Mousetrap.bind("tab", (e) => {
      if (this.state.isInputFocused) my.fetchTabByResultMap();
    });

    Mousetrap.bind("ctrl+enter", (e) => {
      e.preventDefault();
      my.fetchByResultMap();
    });

    Mousetrap.bind("ctrl+h", (e) => {
      e.preventDefault();
      alert(
        `# 단축키\n${
          this.objToStr(this.keyMap)
        }` 
        + '\n\n' +
        `# 명령어 (서버)\n${
          this.objToStr(this.cmdMap.server)
        }`
        + '\n\n' +
        `# 명령어 (클라이언트)\n${
          this.objToStr(this.cmdMap.client)
        }`
      );
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
    socket.on("chat", function (data) {
      console.log(data);
      my.setState({ output: my.state.output + JSON.stringify(data) + "\n" });
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

  objToStr(obj) {
    return Object.entries(obj)
    .map(v => { 
      v[0] = v[0].toUpperCase();
      return '* ' + v.join(': '); 
    })
    .join('\n');
  }

  setViewModeOutput() {
    let domInputHeight = this.domInput.current.clientHeight;
    let fullSize = (window.innerHeight - domInputHeight * 2);
    this.setState({
      domOutputHeight: fullSize,
      domInputBodyHeight: domInputHeight,
      domInputHeight: domInputHeight,
    });
  }

  setViewModeInputBody() {
    let domInputHeight = this.domInput.current.clientHeight;
    let fullSize = (window.innerHeight - domInputHeight * 2);
    this.setState({
      domOutputHeight: domInputHeight,
      domInputBodyHeight: fullSize,
      domInputHeight: domInputHeight,
    });
  }

  setViewModeInput() {
    let domInputHeight = this.domInput.current.clientHeight;
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
    console.log(this.domOutput, this.domInputBody, this.domInput);
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

  getResultMapByCmd = (input) => {
    var regex =
      /'[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\,\.\/\₩\s]+'|"[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\,\.\/\₩\s]+"|[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\,\.\/\₩]+/gi;
    var regexArr = input.trim().match(regex);

    let totalArr = [];
    let curArr = [];
    regexArr.forEach(v => {
      if (v[0] == "-") {
        totalArr.push(curArr);
        curArr = [];
        curArr.push(v);
      } else {
        curArr.push(v);
      }
    });
    totalArr.push(curArr);

    let resultMap = {};
    resultMap["param"] = {};
    resultMap["url"] = totalArr.shift().join("/");
    totalArr.forEach(v => {
      resultMap.param[v.shift()] = v;
    });

    return resultMap;
  };

  fetchTabByResultMap = () => {
    let input = this.state.input;
    let resultMap = this.getResultMapByCmd(input);

    if (resultMap.url == "cli") {
      return alert("only client");
    }

    let method = "GET";

    const requestOptions = {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: undefined,
      timeout: 2000,
    };

    let searchParams = new URLSearchParams(resultMap.param);
    let totalUrl = socketUrl + resultMap.url + "?" + searchParams;

    this.setState({ output: `loading...\n ${totalUrl}` });

    console.log("requestOptions", requestOptions);

    fetch(totalUrl, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("fetch worked!");
        console.log("data", data);

        this.setState({ output: JSON.stringify(data) });

        this.setState({ inputBody: JSON5.stringify(data.defaultMap) });
      })
      .catch((err) => {
        console.log("err!!!", err);
        this.setState({ output: JSON5.stringify(err) });
      });
  };

  fetchByResultMap = () => {
    let input = this.state.input;
    let resultMap = this.getResultMapByCmd(input);

    // http
    let isNeededInputBody =
      Object.keys(JSON5.parse(this.state.inputBody ?? "{}")).length > 0;
    let method = isNeededInputBody ? "POST" : "GET"; // !!resultMap.param["-mp"] ? "POST" : "GET"

    const requestOptions = {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: isNeededInputBody
        ? JSON.stringify(JSON5.parse(this.state.inputBody))
        : undefined,
      timeout: 2000,
    };

    let searchParams = new URLSearchParams(resultMap.param);
    let totalUrl = socketUrl + resultMap.url + "?" + searchParams;

    this.setState({ output: `loading...\n ${totalUrl}` });

    console.log("requestOptions", requestOptions);

    fetch(totalUrl, requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("fetch worked!");
        console.log("data", data);

        this.setState({ output: JSON.stringify(data) });

        this.setState({ inputBody: JSON5.stringify(data.defaultMap) });

        if (data.isExecWs) {
          const inputBody = this.state.inputBody;
          socket.emit(resultMap.url, { msg: inputBody });
        }
      })
      .catch((err) => {
        console.log("err!!!", err);
        this.setState({ output: JSON5.stringify(err) });
      });
  };

  render() {
    return (
      <div>
        <div>
          <AceEditor
            mode="javascript"
            theme="github"
            name="output"
            id="output"
            highlightActiveLine
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false,
              fontSize: "12pt",
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
            theme="github"
            name="inputBody"
            id="inputBody"
            highlightActiveLine
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false,
              fontSize: "12pt",
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
              id="time"
              label="input"
              fullWidth
              value={this.state.input}
              onChange={this.onChangeInput}
              onFocus={() => {
                this.setState({ isEditorFocused: true });
              }}
              onBlur={() => {
                this.setState({ isEditorFocused: false });
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
