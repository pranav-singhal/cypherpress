import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { uploadDocument } from "../../connections/Controller";
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
  submitForm = async () => {
    let array = this.state.formData.map(field => {
      let obj = {};
      obj.name = field.fieldName;
      obj.value = field.fieldValue;
      obj.isFile = false;
      return obj;
    });
    const username = localStorage.getItem("username");
    const alicePublicKey = localStorage.getItem("alicePublicKey");
    const privateKey = localStorage.getItem("privateKey");
    const aliceVerifyingKey = localStorage.getItem("aliceVerifyingKey");
    const callingObject = {
      verifyTransaction: (transaction, gasInEth, transactionName, callback) => {
        console.log(transaction, gasInEth, transactionName);
        callback();
      },
      transactionMining: hash => {
        console.log("hash:", hash);
      },
      insufficientFunds: () => {
        console.log("insufficientFunds");
      }
    };
    await uploadDocument(
      array,
      username,
      alicePublicKey,
      privateKey,
      aliceVerifyingKey,
      callingObject
    );
  };
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
