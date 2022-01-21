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
	let my = this;
	let config = {
		default_input_data: ``,
		send_func: a => alert(a),
	};
    console.log(this.state.input);
	config.send_func(33);
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
