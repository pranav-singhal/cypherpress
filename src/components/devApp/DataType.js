import React, { PropTypes } from "react";
import { Form, Button } from "react-bootstrap";
export default class DataType extends React.Component {
  state = {
    plainTextFields: [],
    fileName: "",
    fileType: false,
    fieldProperties: []
  };
  constructor(props) {
    super(props);
    this.dataTypeRef = React.createRef();
    this.fieldTypeRef = React.createRef();
  }
  componentDidMount() {
    this.handleChange();
  }
  handleSelect = () => {
    const value = this.dataTypeRef.current.value;

    if (value === "Plain Text") {
      this.addField("Plain Text");
    } else {
      console.log("selected file");
      this.setState({ fileType: true });
    }
  };
  addField = type => {
    if (type === "Plain Text") {
      const field = `input-${this.state.plainTextFields.length + 1}`;
      this.setState(prevState => ({
        plainTextFields: prevState.plainTextFields.concat([field]),
        fieldProperties: prevState.fieldProperties.concat([
          { fieldName: "", fieldType: "plainText" }
        ])
      }));
      this.props.addDataField("PlainText");
    } else {
    }
  };
  handleChange = () => {
    if (this.dataTypeRef.current.value !== "choose") {
      this.props.toggleButtonState(false);
    } else {
      this.props.toggleButtonState(true);
    }
  };
  handleFieldNameChange = id => event => {
    const newfieldProperties = this.state.fieldProperties.map((field, idx) => {
      if (id !== idx) {
        return field;
      }
      return { ...field, fieldName: event.target.value };
    });
    this.setState({ fieldProperties: newfieldProperties });
    this.props.handleFieldNameChange(id, event.target.value, "PlainText");
  };
  handleFileNameChange = event => {
    this.setState({ filename: event.target.value });
    // this.props.handleFieldNameChange(id, event.target.value, "file");
    this.props.handleFileNameChange(event.target.value);
  };

  render() {
    return (
      <Form.Group controlId="datatype" onChange={this.handleChange}>
        <Form.Label>Select a datatype</Form.Label>
        <Form.Control
          as="select"
          onChange={this.handleSelect}
          ref={this.dataTypeRef}
        >
          <option>choose</option>
          <option>Plain Text</option>
          <option>File</option>
        </Form.Control>
        {this.state.plainTextFields.map((field, id) => {
          return (
            <React.Fragment key={field}>
              <Form.Control
                placeholder="enter field name"
                ref={this.fieldTypeRef}
                onChange={this.handleFieldNameChange(id)}
              />
              <Form.Control as="select">
                <option>choose</option>
                <option>number</option>

                <option>text</option>
              </Form.Control>
            </React.Fragment>
          );
        })}
        {this.state.fileType ? (
          <Form.Control
            placeholder="enter a file label"
            onChange={this.handleFileNameChange}
          />
        ) : null}
        {this.state.plainTextFields.length > 0 ? (
          <Button
            onClick={() => {
              this.addField("Plain Text");
            }}
          >
            Add another Field{" "}
          </Button>
        ) : null}
      </Form.Group>
    );
  }
}

DataType.propTypes = {};
