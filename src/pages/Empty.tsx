import React, {Component} from 'react';

class Empty extends Component {
  componentDidMount() {
    window
      .history
      .back()
  }
  render() {
    return (
      <div></div>
    )
  }
}

export default Empty;
