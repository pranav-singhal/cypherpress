import React, { PropTypes } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.usernameRef = React.createRef();
    this.privateKeyRef = React.createRef();
  }
  setUser = event => {
    event.preventDefault();
    const username = this.usernameRef.current.value;
    const privateKey = this.privateKeyRef.current.value;
    localStorage.setItem("username", username);
    localStorage.setItem("privateKey", privateKey);
    window.location.reload();
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
