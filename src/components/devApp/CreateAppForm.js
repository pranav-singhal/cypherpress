import React, { PropTypes } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  Form,
  Button
} from "react-bootstrap";
import DelegateInput from "./DelegateInput";
import DataType from "./DataType";
import "../../App.scss";
import { deployContract } from "../../connections/web3Dev";
import { setClientJson } from "../../connections/httpInteractions";

export default class CreateAppForm extends React.Component {
  state = {
    delegates: ["input-1"],
    delegateButtonState: false,
    dataFields: ["field-1"],
    dataFieldButtonDisabled: true,
    delegateInfo: [{ username: "", publicKey: "" }],
    dataInfo: [{ fieldName: "", fieldType: "" }]
  };
  constructor(props) {
    super(props);

    this.appNameRef = React.createRef();
    this.adminPrivateKeyRef = React.createRef();
  }
  addDelegateInfo = () => {
    this.setState(prevState => ({
      delegateInfo: prevState.delegateInfo.concat([
        { username: "", publicKey: "" }
      ])
    }));
    this.addDelegate();
  };
  handleDelegaInfoChange = (id, username, publicKey) => {
    const newDelegateprops = this.state.delegateInfo.map((delegate, idx) => {
      if (id !== idx) {
        return delegate;
      }
      return { ...delegate, username: username, publicKey: publicKey };
    });
    this.setState({ delegateInfo: newDelegateprops });
  };

  toggleButtonState = (button, bool) => {
    if (button === "delegateButtonState") {
      this.setState({ delegateButtonState: bool });
    }
    if (button === "dataFieldButtonDisabled") {
      this.setState({ dataFieldButtonDisabled: bool });
    }
  };

  handleSubmit = async event => {
    event.preventDefault();
    console.log(this.appNameRef);
    const clientAppJson = {};
    clientAppJson.dataInfo = this.state.dataInfo;
    clientAppJson.delegateInfo = this.state.delegateInfo;
    localStorage.setItem("clientAppJson", JSON.stringify(clientAppJson));
    await setClientJson(this.appNameRef.current.value, clientAppJson);
    // get private key
    // deploy contract function
    const adminPrivateKey = this.adminPrivateKeyRef.current.value;
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
    const contractAddress = await deployContract(
      adminPrivateKey,
      callingObject
    );
    await fetch("http://10.0.0.228:5000/setContractAddress", {
      method: "POST",
      body: JSON.stringify({
        contractAddress: contractAddress,
        dappName: this.appNameRef.current.value
      })
    });
    await localStorage.setItem("contractAddress", contractAddress);

    console.log("contract addess set");
    window.open(`/client-app/${this.appNameRef.current.value}`, "_blank");
    //create a clientJson and store it in localstorage
  };
  addDelegate = () => {
    const newDelegate = `input-${this.state.delegates.length + 1}`;
    this.setState(prevState => ({
      delegates: prevState.delegates.concat([newDelegate])
    }));
    console.log(this.delegateButton);
  };

  setDelegateInfo = delegateInfo => {
    this.setState(prevState => ({
      delegateInfo: prevState.delegateInfo.concat([delegateInfo])
    }));
  };
  handleFieldChange = (id, fieldType, fieldName) => {
    const newDataInfo = this.state.dataInfo.map((field, idx) => {
      if (id !== idx) return field;
      return { ...field, fieldType: fieldType, fieldName: fieldName };
    });
    this.setState({ dataInfo: newDataInfo });
  };
  addDataField = () => {
    const newField = `field-${this.state.dataFields.length + 1}`;
    console.log(newField);
    this.setState(prevState => ({
      dataFields: prevState.dataFields.concat([newField]),
      dataInfo: prevState.dataInfo.concat({ fieldName: "", fieldType: "" })
    }));
  };
  render() {
    return (
      <Container>
        <Row>
          <Col sm={12}>
            <h1 className="title"> EthDenver !!!! </h1>
          </Col>
        </Row>
        <Form onSubmit={this.handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="appName">
                <Form.Control
                  placeholder="Enter a name for your app"
                  ref={this.appNameRef}
                />
                <Form.Control
                  controlId="adminPrivateKey"
                  placeholder="enter your private key"
                  ref={this.adminPrivateKeyRef}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {this.state.dataFields.map((field, id) => {
                return (
                  <DataType
                    key={id}
                    handleLabelChange={(fieldType, fieldName) => {
                      this.handleFieldChange(id, fieldType, fieldName);
                    }}
                  />
                );
              })}
            </Col>
            <Button
              variant="primary"
              onClick={() => {
                this.addDataField();
              }}
              disabled={false}
            >
              {" "}
              Add another Data Field
            </Button>
          </Row>

          <Row>
            <Col sm={12}>
              <Col sm={4}>
                {this.state.delegates.map((input, id) => {
                  return (
                    <DelegateInput
                      key={input}
                      toggleButtonState={bool => {
                        this.toggleButtonState("delegateButtonState", bool);
                      }}
                      handleDelegaInfoChange={(username, publicKey) => {
                        this.handleDelegaInfoChange(id, username, publicKey);
                      }}
                    />
                  );
                })}
              </Col>
            </Col>
            <Col>
              <Button
                variant="primary"
                onClick={this.addDelegateInfo}
                disabled={this.state.delegateButtonState}
              >
                Add a delegate
              </Button>
            </Col>
            <Col sm={12}>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }
}

CreateAppForm.propTypes = {};
