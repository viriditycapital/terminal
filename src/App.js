import React from "react";

/**
 * This is the highest level of the web app.
 */
class App extends React.Component {
  constructor() {
    super();
    this.state = { data: [] };
  }

  async componentDidMount() {
    const response = await fetch("/api/stonks");
    const json = await response.json();
    this.setState({ data: json });
  }

  render() {
    return <div id="main">Let's get some data: {JSON.stringify(this.state.data)}</div>;
  }
}

export default App;
