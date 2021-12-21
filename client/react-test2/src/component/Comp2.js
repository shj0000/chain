import React from 'react';
import * as solanaWeb3 from '@solana/web3.js';

class Comp2 extends React.Component {
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
    alert(2255);
    console.log("solanaWeb3");
    console.log(solanaWeb3);
  }
  
  render() {
    return <h1 onClick={this.test}>Button - Send - Account Info{this.props.name}</h1>;
  }
}

export default Comp2;
