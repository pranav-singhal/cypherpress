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
      this.addField("file");
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
    } else if (type === "file") {
      const field = `file-${this.state.plainTextFields.length + 1}`;
      this.setState(prevState => ({
        plainTextFields: prevState.plainTextFields.concat([field]),
        fieldProperties: prevState.fieldProperties.concat([
          { fieldName: "", fieldType: "file" }
        ])
      }));
    }
  };
  handleChange = () => {
    if (this.dataTypeRef.current.value !== "choose") {
      this.props.toggleButtonState(false);
    } else {
      this.props.toggleButtonState(true);
    }
  };
  handleFieldNameChange = (id, type) => event => {
    if (type === "plainText") {
      const newfieldProperties = this.state.fieldProperties.map(
        (field, idx) => {
          if (id !== idx) {
            return field;
          }
          return { ...field, fieldName: event.target.value };
        }
      );
      this.setState({ fieldProperties: newfieldProperties });
      this.props.handleFieldNameChange(id, event.target.value, "PlainText");
    } else if (type === "file") {
      this.props.handleFieldNameChange(id, event.target.value, "file");
    }
  };
  handleFileNameChange = event => {
    this.setState({ filename: event.target.value });
    // this.props.handleFieldNameChange(id, event.target.value, "file");
    // this.props.handleFileNameChange(event.target.value);
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
          return field.slice(0, 5) === "input" ? (
            <React.Fragment key={field}>
              <Form.Control
                placeholder="enter field name"
                ref={this.fieldTypeRef}
                onChange={this.handleFieldNameChange(id, "plainText")}
              />
              <Form.Control as="select">
                <option>choose</option>
                <option>number</option>

                <option>text</option>
              </Form.Control>
            </React.Fragment>
          ) : (
            <Form.Control
              key={field + id.toString()}
              placeholder="enter a file label"
              onChange={this.handleFieldNameChange(id, "file")}
            />
          );
        })}

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
