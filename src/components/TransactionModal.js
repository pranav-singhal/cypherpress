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
  componentDidRecieveProps() {
    console.log("something");
    this.setState({ show: this.props.showModal });
  }
  render() {
    return (
      <Modal show={this.state.show} onHide={this.handleClose}>
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Modal body text goes here.</p>
          </Modal.Body>
          <Button onClick={this.handleClose}>Close</Button>
          <Modal.Footer />
        </Modal.Dialog>
      </Modal>
    );
  }
}

TransactionModal.propTypes = {};
