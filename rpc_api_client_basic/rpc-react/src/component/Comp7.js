import React from 'react';

class Comp7 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {favoritecolor: "red"};
  }
  static getDerivedStateFromProps(props, state) {
    return {favoritecolor: props.favcol };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({favoritecolor: "yellow"})
    }, 1000)
    console.log("test");
  }
  test() {
	let config = {
		default_input_data: ``,
		send_func: a => alert(a),
	};
	config.send_func(33);
  }

  render() {
    return <div>
		<textarea/>
		<hr/>
		<button onClick={this.test}>calc</button>
		<hr/>
		<textarea/>
	</div>;
  }
}

export default Comp7;
