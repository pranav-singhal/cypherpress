import React from 'react';
import {Button, Form} from "react-bootstrap";

export default class AdminRegister extends React.Component {
    state ={
        username: '',
        password: ''
    }

    setPassword = (e) => {

        this.setState({password: e.target.value})
    }
    setUsername = (e) => {
        this.setState({username: e.target.value})
    }
    handleSubmit = () => {
        // check from server for registration
        this.props.setUsername(this.state.username);
        this.props.setPassword(this.state.password);
        localStorage.setItem('adminUsername',this.state.username )
        localStorage.setItem('adminPassword', this.state.password)

    }
    render() {

        return (

             <Form className={'app-form'}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter Username" onChange = {(e) => {this.setUsername(e)}}/>
                    <Form.Text className="text-muted">
                        Enter your username
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange ={(e) => {this.setPassword(e)}}/>
                </Form.Group>


                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange ={(e) => {this.setPassword(e)}}/>
                </Form.Group>

                <Button variant="primary" type="submit" onClick ={ this.handleSubmit}>
                    Register
                </Button>
            </Form>
        )
    }
}