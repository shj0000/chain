import React from 'react';
import io from "socket.io-client";   //모듈 가져오기
const socketUrl = 'http://192.168.110.88:10011/';
const socket = io(socketUrl);  //3001번 포트 사용(서버)

class Comp7 extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			input: "red",
			output: "blue"

		};
	}
  
	componentWillUnmount() {
		socket.off('some event');
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
			my.setState({ output: data });
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
		let defaultInputData = {
			urlPath: 'urlPath',
		};

		function sendFunc(obj, config){
			const inputData = obj.state.input;
			
			console.log(inputData);
			// Send 버튼이 클릭되면
			socket.emit("chat", { msg: inputData });
			// 서버로 메시지를 전송한다.
			
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
  
  
  onChangeTxt = (event) => {
    this.setState({input: event.target.value});
  }
  
  render() {
    return (
		<div>
			<div>
				<textarea value={this.state.input} onChange={this.onChangeTxt}/>
				<hr/>
				<button onClick={this.calc}>calc</button>
				<hr/>
				<textarea value={this.state.output} onChange={this.onChangeTxt}/>
			</div>
			<hr/><hr/>
			<div>
				<textarea value={this.state.input} onChange={this.onChangeTxt}/>
				<hr/>
				<button onClick={this.calcWs}>calcWs</button>
				<hr/>
				<textarea value={this.state.output} onChange={this.onChangeTxt}/>
			</div>
		</div>
	);
  }
}

export default Comp7;