import React from 'react';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import TextField from '@mui/material/TextField';
import io from "socket.io-client";   //모듈 가져오기
const socketUrl = 'http://192.168.110.88:10011/';
const socket = io(socketUrl);  //3001번 포트 사용(서버)

class Comp7 extends React.Component {
  
	constructor(props) {
		super(props);
		this.state = {
			input: "red",
			inputBody: "red",
			output: "blue"

		};
		this.textLog = React.createRef();
	}
  
	componentWillUnmount() {
		socket.off('some event');
	}
	
	componentDidUpdate() {
		this.textLog.current.scrollTop = this.textLog.current.scrollHeight;
	}

	
	componentDidMount() {
		const my = this;
		// 서버로 자신의 정보를 전송한다.
		socket.emit("login", {
		  // name: "ungmo2",
		  name: makeRandomName(),
		  userid: "ungmo2@gmail.com"
		});

		// 서버로부터의 메시지가 수신되면
  		socket.on("login", function(data) {
  			my.setState({ output: data });
  		});
		
        // socket.on("login", data => this.setState({output: data}));

		// 서버로부터의 메시지가 수신되면
		socket.on("chat", function(data) {
			console.log(data);
			my.setState({ output: my.state.output + data + '\n' });
		});
		
		function makeRandomName(){
		  var name = "";
		  var possible = "abcdefghijklmnopqrstuvwxyz";
		  for( var i = 0; i < 3; i++ ) {
			name += possible.charAt(Math.floor(Math.random() * possible.length));
		  }
		  return name;
		}
		
	}
  
	calcWs = () => {
		this.setState({ output: '' });
		let defaultInputData = {
			urlPath: 'urlPath',
		};

		function sendFunc(obj, config){
			const inputData = obj.state.input;
			
			console.log(inputData);
			// Send 버튼이 클릭되면
			socket.emit("cmd", { msg: inputData });
			// 서버로 메시지를 전송한다.
			obj.setState({ output: 'a\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\na\n'})
		};

		let config = {
			defaultInputData: defaultInputData,
			sendFunc: sendFunc,
		};

		config.sendFunc(this, config);
	}
  
  calc = () => {
	let defaultInputData = {
		bodyData: 'bodyData',
		urlPath: 'urlPath',
	};
	function sendFunc(obj, config){
		const inputData = obj.state.input;
		// alert(config.defaultInputData.urlPath);
		// https://jasonwatmore.com/post/2020/02/01/react-fetch-http-post-request-examples
		// Simple POST request with a JSON body using fetch
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ title: 'React POST Request Example' })
		};
		obj.setState({ output: 'loading...' })
		fetch('https://reqres.in/api/posts', requestOptions)
			.then(response => response.json())
			.then(data => obj.setState({ output: data.id }));
	};
	let config = {
		defaultInputData: defaultInputData,
		sendFunc: sendFunc,
	};
	config.sendFunc(this, config);
  }
  
  
  onChangeInput = (event) => {
    this.setState({input: event.target.value});
  }
  
  onChangeInputBody = (event) => {
    this.setState({inputBody: event.target.value});
  }
	
  onChangeOutput = (event) => {
    this.setState({output: event.target.value});
  }
	
	
  //  inputRef = ref => (this.inputRef = ref)
	
	inputProps = {
	  step: 300,
	};
  render() {
    return (
		<div>
			<div>
				<TextField 

					  id="outlined-multiline-flexible"
					  label="Multiline"
					  multiline
					fullWidth
					minRows={10}
					maxRows={20}
				
					ref={this.textLog} 
					value={this.state.output} 
					onChange={this.onChangeOutput}
				/>
				<TextField 

					  id="outlined-multiline-flexible"
					  label="Multiline"
					  multiline
					  fullWidth
					  maxRows={4}
					value={this.state.inputBody} 
					onChange={this.onChangeInputBody}
				/>
				<TextField
					fullWidth  
					id="time" type="text" inputProps={this.inputProps} 
					value={this.state.input} 
					onChange={this.onChangeInput}

				/>
				<Button variant="contained" onClick={this.calc}>calc</Button>
				<Button variant="contained" onClick={this.calcWs}>calcWs</Button>
			</div>
		</div>
	);
  }
}

export default Comp7;
