import React, { PropTypes } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
export default class DataType extends React.Component {
  state = {
    labelValue: "",
    labelPlaceholder: "",
    labelVisible: false,
    labelType: ""
  };
  constructor(props) {
    super(props);
  }
  handleSelect = event => {
    if (event.target.value === "Plain text") {
      this.setState({
        labelPlaceholder: "enter a field label",
        labelVisible: true,
        labelType: "PlainText"
      });
    } else if (event.target.value === "file") {
      this.setState({
        labelPlaceholder: "enter a name for the file",
        labelVisible: true,
        labelType: "file"
      });
    }
  };
  handleLabelChange = event => {
    this.setState({ fieldValue: event.target.value });
    this.props.handleLabelChange(this.state.labelType, event.target.value);
  };
  render() {
    return (
      <>
        <Form.Control as="select" onChange={this.handleSelect}>
          <option>choose</option>
          <option>Plain text</option>
          <option>file</option>
        </Form.Control>
        {this.state.labelVisible ? (
          <Form.Control
            placeholder={this.state.labelPlaceholder}
            onChange={this.handleLabelChange}
          />
        ) : null}
      </>
    );
  }
}

DataType.propTypes = {};
