import React, { PropTypes } from "react";
import { Form, Button } from "react-bootstrap";
export default class DataType extends React.Component {
  state = {
    plainTextFields: [],
    plainTextsubField: []
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
      const field = `input-${this.state.plainTextFields.length + 1}`;
      this.setState(prevState => ({
        plainTextFields: prevState.plainTextFields.concat([field])
      }));
    }
  };
  addField = () => {
    const field = `input-${this.state.plainTextFields.length + 1}`;

    this.setState(prevState => ({
      plainTextFields: prevState.plainTextFields.concat([field])
    }));
  };
  handleChange = () => {
    if (this.dataTypeRef.current.value !== "choose") {
      this.props.toggleButtonState(false);
    } else {
      this.props.toggleButtonState(true);
    }
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
        {this.state.plainTextFields.map(field => {
          return (
            <React.Fragment key={field}>
              <Form.Control
                placeholder="enter field label"
                ref={this.fieldTypeRef}
              />
              <Form.Control as="select">
                <option>choose</option>
                <option>number</option>

                <option>text</option>
              </Form.Control>
            </React.Fragment>
          );
        })}
        {this.state.plainTextFields.length > 0 ? (
          <Button onClick={this.addField}>Add another Field </Button>
        ) : null}
      </Form.Group>
    );
  }
}

DataType.propTypes = {};
