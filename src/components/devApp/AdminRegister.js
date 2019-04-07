import React from 'react';
import {Button, Form} from "react-bootstrap";
import {register} from '../../connections/httpInteractions';
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
    setPrivateKey =(e) => {
        localStorage.setItem('adminPrivateKey', e.target.value)
    }
    handleSubmit = async () => {
        // check from server for registration
        const registered = await register(this.state.username, this.state.password)
        if(registered){
            this.props.setUsername(this.state.username);
            this.props.setPassword(this.state.password);
            localStorage.setItem('adminUsername',this.state.username )
            localStorage.setItem('adminPassword', this.state.password)
        }else{
            alert("this username is already taken")
        }

    }

    render() {

        return (

             <Form className={'app-form'}>
                 <h1> Create A new Account</h1>
                <Form.Group controlId="formBasicEmail">
                    <h2>
                    <Form.Label>Username</Form.Label>
                        </h2>
                    <Form.Control type="text" placeholder="Enter Username" onChange = {(e) => {this.setUsername(e)}}/>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <h2>
                    <Form.Label>Password</Form.Label>
                        </h2>
                    <Form.Control type="password" placeholder="Password" onChange ={(e) => {this.setPassword(e)}}/>
                </Form.Group>


                <Form.Group controlId="formBasicPassword">
                    <h2>
                    <Form.Label>Confirm Password</Form.Label>
                        </h2>
                    <Form.Control type="password" placeholder="Re-enter Password" onChange ={(e) => {this.setPassword(e)}}/>
                </Form.Group>

                 <Form.Group controlId={'formBasicPrivateKey'} >
                     <h2>
                         <Form.Label>
                             Enter your Ethereum Private key
                         </Form.Label>

                     </h2>
                     <p>It will not leave your browser(scout's honor)</p>
                     <Form.Control type={'text'} placeholder={'Private Key'} onChange={(e) => {this.setPrivateKey(e)}} />
                {/* take pvt key input here for admin and store it to localstorage*/}
                </Form.Group>

                <Button variant="primary" type="submit" onClick ={ this.handleSubmit} className={'button'}>
                    Register
                </Button>
            </Form>
        )
    }
}