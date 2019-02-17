import React from "react";
import { Form, Row, Col, Button, File } from "react-bootstrap";
import { uploadDocument } from "../../connections/Controller";
import { getClientJson } from "../../connections/httpInteractions";
import TransactionModal from "../TransactionModal";
export default class UploadPanel extends React.Component {
  constructor(props) {
    super(props);
    this.fileRef = React.createRef();
  }
  state = {
    clientAppJson: {},
    formData: [],
    generateForm: false,
    showModal: false
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
    this.setState({ showModal: true });
    await uploadDocument(
      array,
      username,
      alicePublicKey,
      privateKey,
      aliceVerifyingKey,
      callingObject
    );

    this.setState({ showModal: false });
  };
  generateForm = () => {
    const dataInfo = this.getDataInfo();
    console.log(dataInfo);

    return dataInfo.map((field, id) => {
      console.log(field);
      if (field.fieldType === "PlainText") {
        return (
          <Form.Group>
            <h2>
              <Form.Label>{field.fieldName}</Form.Label>
            </h2>
            <Form.Control
              key={field.fieldName + id.toString()}
              placeholder={"Type Here"}
              onChange={this.handleChange(id)}
            />
          </Form.Group>
        );
      } else {
        return (
          <Form.Group>
            <h2>
              <Form.Label>{field.fieldName}</Form.Label>
            </h2>

            <div className="custom-file">
              <Form.Control
                key={field.fieldName}
                type="file"
                onChange={this.handleFile(id)}
                className="custom-file-input"
                id="inputGroupFile01"
              />
              <label class="custom-file-label" for="inputGroupFile01">
                Choose file
              </label>
            </div>
          </Form.Group>
        );
      }
    });
  };
  render() {
    return (
      <Col>
        <Form>
          {this.state.generateForm ? this.generateForm() : null}
          <Form.Group>
            <Button className="button" onClick={this.submitForm}>
              Submit
            </Button>
          </Form.Group>
        </Form>
        <TransactionModal showModal={this.state.showModal} />
      </Col>
    );
  }
}
