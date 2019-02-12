import React, { PropTypes } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Form,
  Button
} from "react-bootstrap";
export default class CreateAppForm extends React.Component {
  constructor(props) {
    super(props);

    this.appNameRef = React.createRef();
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.appNameRef);
    window.open(`/client-app/${this.appNameRef.current.value}`, "_blank");
  };
  render() {
    return (
      <Container>
        <Row>
          <Col>
            <Form.Group controlId="appName">
              <Form onSubmit={this.handleSubmit}>
                <Form.Control
                  placeholder="Enter a name for your app"
                  ref={this.appNameRef}
                />

                <Form.Text type="text" name="appName" className="text-muted">
                  Enter a name for your app
                </Form.Text>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </Form>
            </Form.Group>
          </Col>
        </Row>
      </Container>
    );
  }
}

CreateAppForm.propTypes = {};
