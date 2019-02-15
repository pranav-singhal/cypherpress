import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { uploadDocument } from "../../connections/Controller";
import { getClientJson } from "../../connections/httpInteractions";
export default class UploadPanel extends React.Component {
  constructor(props) {
    super(props);
    this.fileRef = React.createRef();
  }
  state = {
    clientAppJson: {},
    formData: [],
    generateForm: false
  };
  async componentWillMount() {
    // const clientAppJson = JSON.parse(localStorage.getItem("clientAppJson"));
  }
  async componentDidMount() {
    const clientAppJson = await getClientJson(this.props.appName);
    console.log("clientAppJson:", clientAppJson);
    this.setState({ clientAppJson: clientAppJson });
    this.addFormFields();
    this.setState({ generateForm: true });
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
    console.log("array", array);
    console.log("username", username);
    console.log("alicePublicKey", alicePublicKey);
    console.log("privateKey", privateKey);
    console.log("aliceVerifyingKey", aliceVerifyingKey);

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
              {this.state.generateForm ? this.generateForm() : null}
              <Button onClick={this.submitForm}>Submit</Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    );
  }
}
