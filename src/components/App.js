import React, { Component } from "react";
import logo from "../logo.svg";
import "../App.scss";
import CreateAppForm from "./devApp/CreateAppForm";
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header" />
        <CreateAppForm />
      </div>
    );
  }
}

export default App;
