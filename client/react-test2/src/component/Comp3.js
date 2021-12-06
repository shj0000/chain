import React from 'react';

class Comp3 extends React.Component {
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
     alert(223);
  }
  
  render() {
    return <h1 onClick={this.test}>Button ㅅ{this.props.name}</h1>;
  }
}

export default Comp3;
