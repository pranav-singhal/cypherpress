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
  componentWillMount() {
    const clientAppJson = JSON.parse(localStorage.getItem("clientAppJson"));
    this.setState({ clientAppJson: clientAppJson });
  }
  getDelegates = () => {
    return this.state.clientAppJson.delegateInfo;
  };
  getDataInfo = () => {
    return this.state.clientAppJson.dataInfo;
  };
  generateForm = () => {
    const dataInfo = this.getDataInfo();
    console.log(dataInfo);
    return dataInfo.map(field => {
      console.log(field);
      return (
        <Form.Control
          key={field.fieldName}
          placeholder={`enter your ${field.fieldName}`}
        />
      );
    });
  };
  render() {
    return (
      <Row>
        <Col>
          <Form>
            <Form.Group controlId="uploadForm">
              {this.generateForm()}
            </Form.Group>
          </Form>
        </Col>
      </Row>
    );
  }
}
