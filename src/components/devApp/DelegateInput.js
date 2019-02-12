import React, { PropTypes } from "react";
import { Form } from "react-bootstrap";
export default class DelegateInput extends React.Component {
  constructor(props) {
    super(props);
    this.usernameRef = React.createRef();
    this.publicKeyRef = React.createRef();
  }
  handleChange = () => {
    if (this.usernameRef.current.value && this.publicKeyRef.current.value) {
      this.props.toggleButtonState(false);
    } else {
      this.props.toggleButtonState(true);
    }
  };

  render() {
    return (
      <Form.Group onChange={this.handleChange}>
        <Form.Control
          placeholder="Enter a delegate's username"
          ref={this.usernameRef}
        />

        <Form.Control
          placeholder="Enter a delegate's public key"
          ref={this.publicKeyRef}
        />
      </Form.Group>
    );
  }
}

DelegateInput.propTypes = {};
