import React from 'react';
import JSON5 from 'json5';
import Button from '@mui/material/Button';
// import TextareaAutosize from '@mui/base/TextareaAutosize';
import TextField from '@mui/material/TextField';
import io from "socket.io-client";   //모듈 가져오기
import Mousetrap from 'mousetrap';

const socketUrl = 'http://192.168.110.88:10011/';
const socket = io(socketUrl);  //3001번 포트 사용(서버)

class Comp7 extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			input: ` git   pull   -d a d  -d 'dfad' -w "dafadf" -df adfwd --dfef 'dff'   'text' "text" text 'text' "text"  `.trim(),
			inputBody: ` {\n\n} `.trim(),
			output: "blue"

		};
		this.textInput1 = React.createRef()
		this.textInput2 = React.createRef()
		this.textInput3 = React.createRef()
	}

	focusTextInput(id) {
		// Explicitly focus the text input using the raw DOM API
		// Note: we're accessing "current" to get the DOM node
		if (id === 1) {
		  this.textInput1.current.focus()
		}
		if (id === 2) {
		  this.textInput2.current.focus()
		}
		if (id === 3) {
		  this.textInput3.current.focus()
		}
	}

	componentDidUpdate() {
	}
	
	componentWillUnmount() {
		Mousetrap.unbind("ctrl+q");
		Mousetrap.unbind("alt+1");
		Mousetrap.unbind("alt+2");
		Mousetrap.unbind("alt+3");
		
		socket.off('some event');
	}
	
	componentDidMount() { 
		Mousetrap.bind("alt+1", () => {
		  this.focusTextInput(1)
		})

		Mousetrap.bind("alt+2", () => {
		  this.focusTextInput(2)
		})
		
		Mousetrap.bind("alt+3", () => {
		  this.focusTextInput(3)
		})
		
		Mousetrap.bind("ctrl+q", () => alert(2));
		
		const my = this;
		// 서버로 자신의 정보를 전송한다.
		socket.emit("login", {
			// name: "ungmo2",
			name: makeRandomName(),
			userid: "ungmo2@gmail.com"
		});

		// 서버로부터의 메시지가 수신되면
		socket.on("login", function (data) {
			my.setState({ output: JSON5.stringify(data) });
		});

		// socket.on("login", data => this.setState({output: data}));

		// 서버로부터의 메시지가 수신되면
		socket.on("chat", function (data) {
			console.log(data);
			my.setState({ output: my.state.output + JSON.stringify(data) + '\n' });
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
	}

	onChangeInputBody = (event) => {
		this.setState({ inputBody: event.target.value });
	}

	onChangeInput = (event) => {
		this.setState({ input: event.target.value });
	}


	convertCliToSend = (input) => {
		// TODO :
		// tab으로 치면 url 리스트에서 다음 단어 검색 출력하는 단일 메소드 구현
		// enter는 각 메소드에서 구현 상황에 따라 1. 변수 부족 시 디폴트 데이터 출력 혹은 2. 웹 결과 출력 3. 웹소켓 연결 위한 결과 출력
		// 3번 케이스일 경우, 연결 시 await를 통해 바로 웹소켓 전송.
		// TODO :
		// 웹서버 콜백함수로 데코레이터 패턴 로깅 적용.
		// ... URL 등. 환경 에 따른 ON/OFF
		

		// var input = ` ws   asd   www  -d a d  -d 'dfad' -w "dafadf" -df adfwd --dfef 'dff'   'text' "text" text 'text' "text"          `;
		input = this.state.input;

		var regex = /'[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\,\.\/\₩\s]+'|"[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\,\.\/\₩\s]+"|[ㄱ-ㅎㅏ-ㅣ가-힣A-Za-z0-9!?@#$%^&*():;+-=~{}<>\_\[\]\|\\\,\.\/\₩]+/gi;
		var regexArr = input.trim().match(regex);

		let totalArr = [];
		let curArr = [];
		regexArr.forEach(v => {
			if (v[0] == '-') {
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
		console.log(resultMap);

		console.log("this.state.inputBody");
		console.log(this.state.inputBody);

		// http
		let isNeededInputBody = Object.keys(JSON5.parse(this.state.inputBody ?? '{}')).length > 0;
		console.log('isNeededInputBody', isNeededInputBody);
		let method = isNeededInputBody ? "POST" : "GET" // !!resultMap.param["-mp"] ? "POST" : "GET"
		const requestOptions = {
			method: method,
			headers: { 'Content-Type': 'application/json' },
			body: isNeededInputBody ? JSON.stringify(JSON5.parse(this.state.inputBody)) : undefined,
			timeout: 2000,
		};

		let searchParams = new URLSearchParams(resultMap.param);
		let totalUrl = socketUrl + resultMap.url + '?' + searchParams;
		this.setState({ output: `loading... ${totalUrl}` });
		
		console.log('requestOptions', requestOptions);
		
		fetch(totalUrl, requestOptions)
			.then(response => {
				console.log('fetch worked!');
				this.setState({ output: JSON5.stringify(response) });
				return response.json();
			})
			.then(data => {
				console.log('data', data);
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
			.catch(err => {
				console.log('err!!!', err);
				this.setState({ output: JSON5.stringify(err) });
			});

	}

	//  inputRef = ref => (this.inputRef = ref)

	// ref={this.textLog}

	render() {
		return (
			<div>
				<div>
					<TextField
						inputRef={this.textInput1} 
						inputProps={{ className: "mousetrap" }}
						id="output"
						label="output"
						multiline
						fullWidth
						minRows="15"
						maxRows="15"
						

						value={this.state.output}
//						onChange={this.onChangeOutput}
						
						
//						disabled="true"
					/>
					<TextField
						inputRef={this.textInput2} 
						inputProps={{ className: "mousetrap" }}
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

						autoFocus
					/>
					<Button variant="contained" onClick={this.convertCliToSend}>send</Button>
					<Button variant="contained" onClick={this.convertCliToSend}>tab</Button>
				</div>
			</div>
		);
	}
}

export default Comp7;
