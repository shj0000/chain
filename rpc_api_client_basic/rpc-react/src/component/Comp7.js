import React from 'react';

class Comp7 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		input: "red",
		output: "blue"
	
	};
  }
  
  componentDidMount() {
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
  
  calcWs = () => {
	let defaultInputData = {
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
  
  onChangeTxt = () => {
    console.log(11);
  }
  
  render() {
    return (
		<div>
			<textarea value={this.state.input} onChange={this.onChangeTxt}/>
			<hr/>
			<button onClick={this.calc}>calc</button>
			<hr/>
			<textarea value={this.state.output} onChange={this.onChangeTxt}/>
		</div>
	);
  }
}

export default Comp7;
