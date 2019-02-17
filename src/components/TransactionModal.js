import React, { PropTypes } from "react";
import { Modal, Button } from "react-bootstrap";
export default class TransactionModal extends React.Component {
  state = {
    show: false
  };
  constructor(props) {
    super(props);
  }
  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <Modal show={this.props.showModal} onHide={this.handleClose}>
        Loading...
      </Modal>
    );
  }
}

TransactionModal.propTypes = {};
