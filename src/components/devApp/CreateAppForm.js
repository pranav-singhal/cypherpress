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
export default class CreateAppForm extends React.Component {
  state = {
    delegates: ["input-1"],
    delegateButtonState: true,
    dataFields: ["dataInput-1"],
    dataFieldButtonDisabled: true
  };
  constructor(props) {
    super(props);

    this.appNameRef = React.createRef();
  }
  toggleButtonState = (button, bool) => {
    if (button === "delegateButtonState") {
      this.setState({ delegateButtonState: bool });
    }
    if (button === "dataFieldButtonDisabled") {
      this.setState({ dataFieldButtonDisabled: bool });
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.appNameRef);
    window.open(`/client-app/${this.appNameRef.current.value}`, "_blank");
  };
  addDelegate = () => {
    const newDelegate = `input-${this.state.delegates.length + 1}`;
    this.setState(prevState => ({
      delegates: prevState.delegates.concat([newDelegate])
    }));
    console.log(this.delegateButton);
  };
  addDataField = () => {
    const newDataField = `dataInput-${this.state.dataFields.length + 1}`;
    this.setState(prevState => ({
      dataFields: prevState.dataFields.concat([newDataField])
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
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {this.state.dataFields.map(input => {
                return (
                  <DataType
                    key={input}
                    toggleButtonState={bool => {
                      this.toggleButtonState("dataFieldButtonDisabled", bool);
                    }}
                  />
                );
              })}
            </Col>
            <Button
              variant="primary"
              onClick={this.addDataField}
              disabled={this.state.dataFieldButtonDisabled}
            >
              {" "}
              Add another Data Field
            </Button>
          </Row>

          <Row>
            <Col sm={12}>
              <Col sm={4}>
                {this.state.delegates.map(input => {
                  return (
                    <DelegateInput
                      key={input}
                      toggleButtonState={bool => {
                        this.toggleButtonState("delegateButtonState", bool);
                      }}
                    />
                  );
                })}
              </Col>
            </Col>
            <Col>
              <Button
                variant="primary"
                onClick={this.addDelegate}
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
