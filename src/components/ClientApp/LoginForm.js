import React, {PropTypes} from "react";
import {Form, Button, Container, Row, Col} from "react-bootstrap";
import {
    doConnections,
    checkUsernameAvailability,
    signUpAndGetNucypherKeys
} from "../../connections/Controller";
import TransactionModal from "../TransactionModal";
import {getProjectOwnerName} from "../../connections/httpInteractions";

export default class LoginForm extends React.Component {
    state = {
        showModal: false,
        projectAdmin: ''
    };

    constructor(props) {
        super(props);
        this.usernameRef = React.createRef();
        this.privateKeyRef = React.createRef();
        this.passwordRef = React.createRef();
    }

    async componentWillMount() {
        console.log("doConnections completed");
        console.log("appname", this.props.appname)
        const projectAdmin = await getProjectOwnerName(this.props.appname)
        console.log('project admin',projectAdmin)
        this.setState({projectAdmin: projectAdmin});
    }

    setUser = async event => {
        event.preventDefault();
        const username = this.usernameRef.current.value;
        const password = this.passwordRef.current.value;
        const usernameAvailable = await checkUsernameAvailability(username);
        if (usernameAvailable) {
            const privateKey = this.privateKeyRef.current.value;
            const callingObject = {
                verifyTransaction: (
                    transaction,
                    gasInEth,
                    transactionName,
                    callback
                ) => {
                    console.log(transaction, gasInEth, transactionName);
                    callback();
                },
                transactionMining: hash => {
                    console.log("hash:", hash);
                },
                insufficientFunds: () => {
                    console.log("insufficientFunds");
                }
            };
            this.setState({showModal: true});
            let {
                aliceKey,
                bobKey
            } = await signUpAndGetNucypherKeys(username, privateKey, password, callingObject);
            this.setState({showModal: false});


            localStorage.setItem('aliceKey', aliceKey);
            localStorage.setItem('bobKey', bobKey);
            localStorage.setItem('password', password)
            localStorage.setItem("username", username);
            localStorage.setItem("privateKey", privateKey);
            window.location.reload();
        } else {
            alert("username already taken");
        }
    };

    render() {
        return (
            <Container className={'client-auth'}>
                <Row>
                    <Col md={12}>
                        <h1 className={'title'}> {this.props.appname}</h1> <br/>
                    </Col>
                    <Col md={12}>
                        <Row className={'creator-credits'}>
                            <Col md={10}/>
                            <Col md={2}>
                                <h4>Created By {<span> {this.state.projectAdmin} </span>}</h4>
                            </Col>
                        </Row>
                    </Col>

                </Row>
                <Row>
                    <Col>
                        <Row>
                            <Col md={10}/>
                            <Col md={2}>
                                <p>
                                    <span className={'cypherPress'}> Powered By: <a href="/" target={'_blank'}> CypherPress</a> </span>
                                </p>
                            </Col>
                        </Row>
                        <p>
                            To continue, please provide the following details
                        </p>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form className={'app-form'}>
                            <Form.Group controlId="username">
                                <h1>
                                    <Form.Label>Username</Form.Label>
                                </h1>
                                <Form.Control
                                    type="text"
                                    placeholder="Username"
                                    ref={this.usernameRef}
                                />
                                <Form.Text className="text-muted">
                                    Please enter A Username
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="privateKey">
                                <h1>
                                    <Form.Label>Ethereum Private Key</Form.Label>
                                </h1>
                                <Form.Control
                                    type="text"
                                    placeholder="Private Key"
                                    ref={this.privateKeyRef}
                                />
                                <Form.Text className="text-muted">
                                    Please enter your Private Key(We will not share it with
                                    anyone)
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId='password'>
                                <h1>
                                    <Form.Label> Password</Form.Label>
                                </h1>
                                <Form.Control
                                    type='password'
                                    placeholder={'enter a password'}
                                    ref={this.passwordRef}
                                />
                                <Form.Text>
                                    Please enter a password atlest 16 characters long
                                </Form.Text>


                            </Form.Group>

                            <Button variant="primary" type="submit" onClick={this.setUser} className={'button'}>
                                Submit
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <TransactionModal showModal={this.state.showModal}/>
            </Container>
        );
    }
}

LoginForm.propTypes = {};
