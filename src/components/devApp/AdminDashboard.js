import React from 'react';
import CreateAppForm from "./CreateAppForm";
import Home from "../Home";
import Button from 'react-bootstrap/Button'
import {Col, Jumbotron, Row} from "react-bootstrap";

export default class AdminDashboard extends React.Component {
    componentDidMount() {
        localStorage.removeItem('clientAppJson')
    }

    render() {
        return (

            <div className="admin-dashboard">
                <header className="App-header"/>
                <Jumbotron className="jumbotron">
                    <Row>
                        <Col md={12}>
                            <h1 className="main">CypherPress</h1>
                        </Col>
                        <Col md={4}/>
                        <Col md={4}>
                            <p>
                                The WYSIWYG for NuCypher + IPFS
                            </p>
                            <p>
                                <a href="https://github.com/pranav-singhal/cypherpress" target={'_blank'}>
                                    <i className="fab fa-github"></i>
                                </a>

                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>

                            <Button
                                variant="primary"
                                type="submit"
                                className="button"
                                onClick={() => {
                                    this.props.setRoute('/admin-apps')
                                }}
                            >
                                Your Previous Apps
                            </Button>

                        </Col>
                        <Col md={6}>
                            <Button
                                variant="primary"
                                type="submit"
                                className="button"
                                onClick={() => {
                                    this.props.setRoute('/create-new-app')
                                }}
                            >
                                Create a new app
                            </Button>
                        </Col>
                    </Row>
                </Jumbotron>

            </div>
        )
    }
}