import React, { PropTypes } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import {
  doConnections,
  checkUsernameAvailability,
  signUpAndGetNucypherKeys
} from "../../connections/Controller";
import TransactionModal from "../TransactionModal";
export default class LoginForm extends React.Component {
  state = {
    showModal: false
  };
  constructor(props) {
    super(props);
    this.usernameRef = React.createRef();
    this.privateKeyRef = React.createRef();
    this.passwordRef = React.createRef();
  }
  async componentWillMount() {
    console.log("doConnections completed");
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
      this.setState({ showModal: true });
      let {
        aliceKey,
        bobKey
      } = await signUpAndGetNucypherKeys(username, privateKey, password, callingObject);
      this.setState({ showModal: false });



      localStorage.setItem('aliceKey', aliceKey);
      localStorage.setItem('bobKey', bobKey);
      localStorage.setItem('password',password)
      localStorage.setItem("username", username);
      localStorage.setItem("privateKey", privateKey);
      window.location.reload();
    } else {
      alert("username already taken");
    }
  };

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
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
                <Form.Label>private Key</Form.Label>
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
                <Form.Label> Password</Form.Label>
                  <Form.Control
                      type='text'
                      placeholder={'enter a password'}
                      ref={this.passwordRef}
                  />
                <Form.Text>
                  Please enter a password
                </Form.Text>



              </Form.Group>

              <Button variant="primary" type="submit" onClick={this.setUser}>
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
        <TransactionModal showModal={this.state.showModal} />
      </Container>
    );
  }
}

LoginForm.propTypes = {};
