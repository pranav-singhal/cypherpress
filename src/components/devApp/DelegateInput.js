import React, { PropTypes } from "react";
import { Form } from "react-bootstrap";
export default class DelegateInput extends React.Component {
  constructor(props) {
    super(props);
    this.usernameRef = React.createRef();
    this.publicKeyRef = React.createRef();
  }
  state = {
    username: "",
    publicKey: ""
  };
  handleChange = () => {
    if (this.usernameRef.current.value && this.publicKeyRef.current.value) {
      this.props.toggleButtonState(false);
    } else {
      this.props.toggleButtonState(true);
    }
  };

  setDelegateInfo = () => {
    const delegateInfo = {};
    delegateInfo.username = this.usernameRef.current.value;
    delegateInfo.publicKey = this.publicKeyRef.current.value;
    console.log(delegateInfo);
    return delegateInfo;
  };
  handleBlur = () => {
    if (this.usernameRef.current.value && this.publicKeyRef.current.value) {
      const delegateInfo = this.setDelegateInfo();
      this.setState({ delegateInfo });
      this.props.setDelegateInfo(delegateInfo);
    }
  };
  handleFocus = () => {
    // 1 first find that object in the parent component's state using username or public key
    // 2 change the username or public key of that particular object dynamically
  };
  updateUsername = event => {
    this.setState({ username: event.target.value });
    this.handleDelegaInfoChange(event.target.value);
  };
  updatePublicKey = event => {
    this.setState({ publicKey: event.target.value });
    this.handleDelegaInfoChange(null, event.target.value);
  };
  handleDelegaInfoChange = (username, publicKey) => {
    if (!publicKey) {
      this.props.handleDelegaInfoChange(username, this.state.publicKey);
    }
    if (!username) {
      this.props.handleDelegaInfoChange(this.state.username, publicKey);
    }
  };

  render() {
    return (
      <Form.Group>
        <Form.Control
          placeholder="Enter a delegate's username"
          ref={this.usernameRef}
          onChange={this.updateUsername}
        />

        {/*<Form.Control
          placeholder="Enter a delegate's public key"
          ref={this.publicKeyRef}
          onChange={this.updatePublicKey}
        />*/}
      </Form.Group>
    );
  }
}

DelegateInput.propTypes = {};
