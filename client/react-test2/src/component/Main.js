import React from 'react';

class Main extends React.Component {
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

  render() {
    return <h1> --- {this.props.name}</h1>;
  }
}

export default Main;
