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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DelegateInput from "./DelegateInput";
import DataType from "./DataType";
import "../../App.scss";
import TransactionModal from "../TransactionModal";
import { deployContract } from "../../connections/web3Dev";
import { setClientJson } from "../../connections/httpInteractions";

export default class CreateAppForm extends React.Component {
  state = {
    delegates: ["input-1"],
    delegateButtonState: false,
    dataFields: ["field-1"],
    dataFieldButtonDisabled: true,
    delegateInfo: [{ username: "", publicKey: "" }],
    dataInfo: [{ fieldName: "", fieldType: "" }],
    showModal: false
  };
  constructor(props) {
    super(props);

    this.appNameRef = React.createRef();
    this.adminPrivateKeyRef = React.createRef();
  }
  componentDidMount() {
    console.log("mounted");
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
    await fetch("http://172.16.4.93:5000/setContractAddress", {
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
      <Container className="devApp">
        <Row>
          <Col md={12}>
            <h1 className="title"> CypherPress</h1>
          </Col>
        </Row>
        <Row className="CreateAppForm">
          <Col md={3} />
          <Col md={6}>
            <Form onSubmit={this.handleSubmit}>
              <Row>
                <Col>
                  <Form.Group>
                    <h2>
                      <Form.Label> Select an App Name </Form.Label>
                    </h2>
                    <Form.Control
                      ref={this.appNameRef}
                      placeholder="Enter Name Here"
                    />
                    <Form.Text>
                      This will be the name of your new decentralised DataBase
                    </Form.Text>
                  </Form.Group>
                  <Form.Group>
                    <h2>
                      <Form.Label> Enter Your Private Key</Form.Label>
                    </h2>
                    <Form.Control
                      ref={this.adminPrivateKeyRef}
                      placeholder="Enter Private Key Here"
                    />
                    <Form.Text>
                      We Promise that your private key will not leave your
                      browser(Buffy's honor)
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Row>
                    <Col md={12}>
                      <h2>Add DataFields</h2>
                    </Col>
                    <Form.Text>
                      You can store PlainText data where you need to supply a
                      'label' for the field, or you can store files (on IPFS)
                      which you can access
                    </Form.Text>
                  </Row>
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

                <Col md={12}>
                  <FontAwesomeIcon
                    icon="plus-circle"
                    className="plus-circle"
                    onClick={() => {
                      this.addDataField();
                    }}
                  />
                </Col>
              </Row>

              <Row>
                {/* <Col md={12}>
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
                <Col>
                  <Button
                    variant="primary"
                    onClick={this.addDelegateInfo}
                    disabled={this.state.delegateButtonState}
                  >
                    Add a delegate
                  </Button>
                </Col>*/}
                <Col sm={12}>
                  <Button
                    variant="primary"
                    type="submit"
                    className="RenderAppButton"
                  >
                    Render App
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <TransactionModal showModal={this.state.showModal} />
      </Container>
    );
  }
}

CreateAppForm.propTypes = {};
