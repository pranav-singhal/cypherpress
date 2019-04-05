import React, {Component} from "react";
import logo from "../logo.svg";
import "../App.scss";
import Home from "./Home";
import CreateAppForm from "./devApp/CreateAppForm";
import {library} from "@fortawesome/fontawesome-svg-core";

import {
    faCheckSquare,
    faCoffee,
    faPlusCircle,
    faUpload,
    faDownload,
    faLink,
    faCheck,
    faTimes
} from "@fortawesome/free-solid-svg-icons";

library.add(faCheckSquare, faPlusCircle, faUpload, faDownload, faLink, faCheck, faTimes);

class App extends Component {
    state = {
        launchApp: false
    };

    render() {
        return (
            <div className="App">
                <header className="App-header"/>
                {this.state.launchApp ? (
                    <CreateAppForm/>
                ) : (
                    <Home
                        mountApp={() => {
                            this.setState({launchApp: true});
                        }}
                    />
                )}
            </div>
        );
    }
}

export default App;
