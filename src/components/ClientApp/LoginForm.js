import React, { PropTypes } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import {
  doConnections,
  checkUsernameAvailability,
  signUpAndGetNucypherKeys
} from "../../connections/Controller";
export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.usernameRef = React.createRef();
    this.privateKeyRef = React.createRef();
  }
  async componentWillMount() {
    const contractAddress = localStorage.getItem("contractAddress");
    await doConnections(contractAddress);
    console.log("doConnections completed");
  }
  setUser = async event => {
    event.preventDefault();
    const username = this.usernameRef.current.value;
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
      let {
        alicePrivateKey,
        alicePublicKey,
        aliceSigningKey,
        aliceVerifyingKey
      } = await signUpAndGetNucypherKeys(username, privateKey, callingObject);
      localStorage.setItem("alicePrivateKey", alicePrivateKey);
      localStorage.setItem("alicePublicKey", alicePublicKey);
      localStorage.setItem("aliceSigningKey", aliceSigningKey);
      localStorage.setItem("aliceVerifyingKey", aliceVerifyingKey);

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

              <Button variant="primary" type="submit" onClick={this.setUser}>
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

LoginForm.propTypes = {};
