import React, { PropTypes } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
export default class UploadPanel extends React.Component {
  constructor(props) {
    super(props);
    this.fileRef = React.createRef();
  }
  state = {
    clientAppJson: {}
  };
  componentDidMount() {
    const clientAppJson = JSON.parse(localStorage.getItem("clientAppJson"));
    this.setState({ clientAppJson: clientAppJson });
  }
  getDelegates = () => {
    //returns a list of people you can delegate access to

    return this.state.clientAppJson.delegateInfo;
  };
  getDataInfo = () => {
    return this.state.dataInfo;
  };
  render() {
    return (
      <Row>
        <Col>
          <Form>
            <Form.Group controlId="fileUpload">
              <Form.Label>Upload File</Form.Label>
              <Form.Control
                type="file"
                placeholder="Select file for Upload"
                ref={this.fileRef}
              />
              <Form.Text className="text-muted">
                Upload a file to IPFS
              </Form.Text>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    );
  }
}
