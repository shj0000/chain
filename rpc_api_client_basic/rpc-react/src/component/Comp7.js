import React from "react";
import JSON5 from "json5";
import Button from "@mui/material/Button";
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
    this.state = {
      input:
        ` git   pull   -d a d  -d 'dfad' -w "dafadf" -df adfwd --dfef 'dff'   'text' "text" text 'text' "text"  `.trim(),
      inputBody: ` {\n\n} `.trim(),
      output: "blue",
      isEditorFocused: false,
    };
    this.textInput1 = React.createRef();
    this.textInput2 = React.createRef();
    this.textInput3 = React.createRef();
  }

  focusTextInput(id) {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    console.log(this.textInput1, this.textInput2, this.textInput3);
    if (id === 1) {
      this.textInput1.current.editor.textInput.focus();
    }
    if (id === 2) {
      this.textInput2.current.editor.textInput.focus();
    }
    if (id === 3) {
      this.textInput3.current.focus();
    }
  }

  componentDidUpdate() {
    [...document.getElementsByClassName("ace_text-input")].forEach((e) => {
      e.classList.add("mousetrap");
    });
  }

  componentWillUnmount() {
    let keyList = ["ctrl+q", "alt+1", "alt+2", "alt+3"];
    keyList.forEach((key) => {
      Mousetrap.unbind(key);
    });

    socket.off("some event");
  }

  componentDidMount() {
    [...document.getElementsByClassName("ace_text-input")].forEach((e) => {
      e.classList.add("mousetrap");
    });

    Mousetrap.bind("alt+1", () => {
      this.focusTextInput(1);
    });

    Mousetrap.bind("alt+2", () => {
      this.focusTextInput(2);
    });

    Mousetrap.bind("alt+3", () => {
      this.focusTextInput(3);
    });

    Mousetrap.bind("enter", (e) => {
      // console.log(this.textInput3);
      // const isInputFocused = this.textInput3.current.focus();
      if (this.state.isEditorFocused) alert(1);
    });

    Mousetrap.bind("tab", (e) => {
      // const isInputFocused = this.textInput3.current.focus();
      if (this.state.isEditorFocused) alert(2);
    });

    Mousetrap.bind("shift+enter", (e) => {
      e.preventDefault();
      alert(3);
    });

    Mousetrap.bind("shift+tab", (e) => {
      e.preventDefault();
      alert(4);
    });

    Mousetrap.bind("ctrl+q", () => alert(2));

    const my = this;
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

    // socket.on("login", data => this.setState({output: data}));

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

  // 	calcWs = () => {
  // 		this.setState({ output: '' });
  // 		let defaultInputData = {
  // 			urlPath: 'urlPath',
  // 		};

  // 		function sendFunc(obj, config) {
  // 			const inputData = obj.state.input;

  // 			console.log(inputData);
  // 			// Send 버튼이 클릭되면
  // 			socket.emit("cmd", { msg: inputData });
  // 			// 서버로 메시지를 전송한다.
  // 			obj.setState({ output: 'a\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\n' })
  // 		};

  // 		let config = {
  // 			defaultInputData: defaultInputData,
  // 			sendFunc: sendFunc,
  // 		};

  // 		config.sendFunc(this, config);
  // 	}

  // 	calc = () => {
  // 		let defaultInputData = {
  // 			bodyData: 'bodyData',
  // 			urlPath: 'urlPath',
  // 		};
  // 		function sendFunc(obj, config) {
  // 			const inputData = obj.state.input;
  // 			// alert(config.defaultInputData.urlPath);
  // 			// https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
  // 			// Simple POST request with a JSON body using fetch
  // 			const requestOptions = {
  // 				method: 'POST',
  // 				headers: { 'Content-Type': 'application/json' },
  // 				body: JSON.stringify({ title: 'React POST Request Example' })
  // 			};
  // 			obj.setState({ output: 'loading...' })
  // 			fetch('https://reqres.in/api/posts', requestOptions)
  // 				.then(response => response.json())
  // 				.then(data => obj.setState({ output: data.id }));
  // 		};
  // 		let config = {
  // 			defaultInputData: defaultInputData,
  // 			sendFunc: sendFunc,
  // 		};
  // 		config.sendFunc(this, config);
  // 	}

  onChangeOutput = (event) => {
    this.setState({ output: event.target.value });
  };

  onChangeInputBody = (newValue) => {
    this.setState({ inputBody: newValue });
  };

  onChangeInput = (event) => {
    this.setState({ input: event.target.value });
  };

  convertCliToSend = (input) => {
    // var input = ` ws   asd   www  -d a d  -d 'dfad' -w "dafadf" -df adfwd --dfef 'dff'   'text' "text" text 'text' "text"          `;
    input = this.state.input;

    var regex =
      /'[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\,\.\/\₩\s]+'|"[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\,\.\/\₩\s]+"|[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\,\.\/\₩]+/gi;
    var regexArr = input.trim().match(regex);

    let totalArr = [];
    let curArr = [];
    regexArr.forEach((v) => {
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
    totalArr.forEach((v) => {
      resultMap.param[v.shift()] = v;
    });
    console.log(resultMap);

    console.log("this.state.inputBody");
    console.log(this.state.inputBody);

    // http
    let isNeededInputBody =
      Object.keys(JSON5.parse(this.state.inputBody ?? "{}")).length > 0;
    console.log("isNeededInputBody", isNeededInputBody);
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
    this.setState({ output: `loading... ${totalUrl}` });

    console.log("requestOptions", requestOptions);

    fetch(totalUrl, requestOptions)
      .then((response) => {
        console.log("fetch worked!");
        this.setState({ output: JSON5.stringify(response) });
        return response.json();
      })
      .then((data) => {
        console.log("data", data);
        this.setState({ output: JSON.stringify(data) });
        this.setState({ inputBody: JSON5.stringify(data.defaultMap) });

        if (data.isExecWs) {
          const inputBody = this.state.inputBody;

          // console.log(inputBody);
          // Send 버튼이 클릭되면
          socket.emit(resultMap.url, { msg: inputBody });
          // 서버로 메시지를 전송한다.
          // 					this.setState({
          // 						output:
          // 							'a\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na'
          // 							+ '\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na'
          // 							+ '\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na'
          // 							+ '\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na'
          // 							+ '\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na'
          // 							+ '\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na'
          // 					});
        }
      })
      .catch((err) => {
        console.log("err!!!", err);
        this.setState({ output: JSON5.stringify(err) });
      });
  };

  //  inputRef = ref => (this.inputRef = ref)

  // ref={this.textLog}

  render() {
    return (
      <div>
        <div>
          <AceEditor
            mode="javascript"
            theme="github"
            name="output"
            showPrintMargin
            wrapEnabled
            showGutter
            highlightActiveLine
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false,
              // fontFamily: "tahoma",
              fontSize: "10pt",
            }}
            style={{
              // position: 'relative',
              width: "calc(100%)",
              height: "calc(200px)",
            }}
            readOnly
            ref={this.textInput1}
            props={{ className: "mousetrap" }}
            id="output"
            label="output"
            multiline
            fullWidth
            value={this.state.output}
          />

          <AceEditor
            mode="javascript"
            theme="github"
            name="inputBody"
            showPrintMargin
            wrapEnabled
            showGutter
            highlightActiveLine
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false,

              // enableSnippets: true,
              // fontFamily: "tahoma",
              fontSize: "12pt",
            }}
            style={{
              // position: 'relative',
              width: "calc(100% - 100px)",
              height: "200px",
            }}
            ref={this.textInput2}
            props={{ className: "mousetrap" }}
            className="mousetrap"
            id="input-body"
            label="inputBody"
            multiline
            fullWidth
            minRows="5"
            maxRows="5"
            value={this.state.inputBody}
            onChange={this.onChangeInputBody}
          />
          <TextField
            inputRef={this.textInput3}
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
          <Button variant="contained" onClick={this.convertCliToSend}>
            send
          </Button>
          <Button variant="contained" onClick={this.convertCliToSend}>
            tab
          </Button>
        </div>
      </div>
    );
  }
}

export default Comp7;
