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
    const response = await fetch('/api');
    const json = await response.json();
    this.setState({ data: json });
  }

  render() {
    return <div id="App">Hello World {JSON.stringify(this.state.data)}</div>;
  }
}

export default App;
