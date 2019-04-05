import React, {Component} from "react";
import logo from "../logo.svg";
import "../App.scss";
import Home from "./Home";
import CreateAppForm from "./devApp/CreateAppForm";
import {library} from "@fortawesome/fontawesome-svg-core";
import Button from 'react-bootstrap';

import {
    faCheckSquare,
    faCoffee,
    faPlusCircle,
    faUpload,
    faDownload,
    faLink,
    faCheck,
    faTimes,
    faFile
} from "@fortawesome/free-solid-svg-icons";
import AdminDashboard from "./devApp/AdminDashboard";
import AdminLogin from "./devApp/AdminLogin";
import AdminRegister from "./devApp/AdminRegister";

library.add(faCheckSquare, faPlusCircle, faUpload, faDownload, faLink, faCheck, faTimes, faFile);

class App extends Component {
    state = {

        adminUsername: '',
        adminPassword: ''
    };


    render() {
        if (localStorage.getItem('adminUsername'), localStorage.getItem('adminPassword')) {
            return (


                <AdminDashboard setRoute = {(route) => {this.props.history.push(route)}}></AdminDashboard>

            );
        } else {
            return (
                <div>
                    
                    <AdminLogin
                        setUsername={(username) => {
                            this.setState({adminUsername: username})
                        }}
                        setPassword={(password) => {
                            this.setState({adminPassword: password})
                        }}/>


                    <AdminRegister
                        setUsername={(username) => {
                            this.setState({adminUsername: username})
                        }}
                        setPassword={(password) => {
                            this.setState({adminPassword: password})
                        }}/>


                </div>
            );
        }
        ;

    }
}

export default App;
