import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
export default class UploadPanel extends React.Component {
  constructor(props) {
    super(props);
    this.fileRef = React.createRef();
  }
  state = {
    clientAppJson: {},
    formData: []
  };
  componentWillMount() {
    const clientAppJson = JSON.parse(localStorage.getItem("clientAppJson"));
    this.setState({ clientAppJson: clientAppJson });
  }
  componentDidMount() {
    this.addFormFields();
  }
  getDelegates = () => {
    return this.state.clientAppJson.delegateInfo;
  };
  getDataInfo = () => {
    return this.state.clientAppJson.dataInfo;
  };
  addFormFields = () => {
    const dataInfo = this.getDataInfo();
    dataInfo.map((field, id) => {
      const newField = { fieldName: field.fieldName, fieldValue: "" };
      this.setState(prevState => ({
        formData: prevState.formData.concat([newField])
      }));
    });
  };
  handleChange = id => event => {
    console.log("handling");
    const newFormData = this.state.formData.map((field, idx) => {
      if (idx !== id) return field;
      return { ...field, fieldValue: event.target.value };
    });
    this.setState({ formData: newFormData });
  };
  submitForm = () => {};
  generateForm = () => {
    const dataInfo = this.getDataInfo();
    console.log(dataInfo);

    return dataInfo.map((field, id) => {
      console.log(field);

      return (
        <Form.Control
          key={field.fieldName}
          placeholder={`enter your ${field.fieldName}`}
          onChange={this.handleChange(id)}
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
              <Button onClick={this.submitForm}>Submit</Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    );
  }
}
