import React from "react";
import { Form, Row, Col, Button, File } from "react-bootstrap";
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
      const newField = {
        fieldName: field.fieldName,
        fieldValue: "",
        isFile: field.fieldType === "file"
      };
      this.setState(prevState => ({
        formData: prevState.formData.concat([newField])
      }));
    });
  };
  handleChange = id => event => {
    console.log(id);
    event.preventDefault();
    const newFormData = this.state.formData.map((field, idx) => {
      if (idx !== id) return field;

      let obj = { ...field, fieldValue: event.target.value };

      return obj;
    });
    console.log("newFormData", newFormData);
    this.setState({ formData: newFormData });
  };
  handleFile = id => event => {
    event.preventDefault();
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(event.target.files[0]);
    reader.onloadend = () => {
      let newFormData = this.state.formData;

      let readerresult = reader.result;

      newFormData[id].fieldValue = readerresult;

      this.setState({ formData: newFormData });
    };
  };
  submitForm = async () => {
    let array = this.state.formData.map(field => {
      let obj = {};
      obj.name = field.fieldName;
      obj.value = field.fieldValue;
      obj.isFile = field.isFile;
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
      if (field.fieldType === "PlainText") {
        return (
          <Form.Control
            key={field.fieldName + id.toString()}
            placeholder={`enter your ${field.fieldName}`}
            onChange={this.handleChange(id)}
          />
        );
      } else {
        return (
          <Form.Group>
            <Form.Label>{field.fieldName}</Form.Label>
            <Form.Control
              key={field.fieldName}
              type="file"
              onChange={this.handleFile(id)}
            />
          </Form.Group>
        );
      }
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
