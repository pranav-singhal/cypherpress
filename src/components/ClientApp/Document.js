import React, { PropTypes } from "react";
import { Form, Button } from "react-bootstrap";
import { getDelegatees, isDelegatee } from "../../connections/Controller";
export default class Document extends React.Component {
  state = {
    delegatees: [],
    selectedDelegatees: []
  };
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    console.log(this.props.dataArray);
    await this.fetchDelegatees();
  }
  displayData = data => {
    if (!data.isFile) {
      return (
        <p key={data.name}>
          {data.name} <i>{data.value}</i>
        </p>
      );
    }
  };
  setDelegatees = async () => {};
  fetchDelegatees = async () => {
    const allDelegatees = await getDelegatees();
    let potentialDelegatees = [];
    allDelegatees.forEach(async delegate => {
      console.log("delegate:", delegate);
      let bool = await isDelegatee(this.props.documentId, delegate);
      if (bool) {
        return;
      } else {
        potentialDelegatees.push(delegate);
        this.setState(prevState => ({
          delegatees: [...prevState.delegatees, delegate]
        }));
      }
    });
    return potentialDelegatees;
  };
  handleSelect = event => {
    const name = event.target.name;
    if (this.state.selectedDelegatees.indexOf(name) == -1) {
      this.setState(prevState => ({
        selectedDelegatees: prevState.selectedDelegatees.concat(name)
      }));
    } else {
      let newDelegates = this.state.selectedDelegatees;
      newDelegates.pop(name);
      this.setState({ selectedDelegatees: newDelegates });
    }
  };
  render() {
    return (
      <React.Fragment>
        <hr />
        {this.props.dataArray.map((data, id) => {
          return this.displayData(data);
        })}
        <h1>Select the delegatess from below</h1>
        {this.state.delegatees.map((delegate, id) => {
          return (
            <Form.Check
              type="checkbox"
              label={delegate}
              key={delegate + id}
              name={delegate}
              onChange={this.handleSelect}
            />
          );
        })}
        <Button onClick={this.setDelegatees}>Grant access</Button>
      </React.Fragment>
    );
  }
}

// Document.propTypes = {};
