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
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.transactionName}</Modal.Title>
          </Modal.Header>

          <Modal.Body>gasInEth : {this.props.gasInEth}</Modal.Body>
          <Button
            onClick={() => {
              this.props.completeTransaction();
              this.props.toggleModal(false);
            }}
          >
            Close
          </Button>
          <Modal.Footer />
        </Modal.Dialog>
      </Modal>
    );
  }
}

TransactionModal.propTypes = {};
