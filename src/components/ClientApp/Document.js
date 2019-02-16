import React from "react";
import { Form, Button } from "react-bootstrap";
import {
  getDelegatees,
  isDelegatee,
  grantDocumentAccess
} from "../../connections/Controller";
export default class Document extends React.Component {
  state = {
    delegatees: [],
    selectedDelegatees: []
  };

  async componentDidMount() {
    console.log(this.props.dataArray);
    if (!this.props.fetchedData) {
      await this.fetchDelegatees();
    }
  }
  displayData = data => {
    console.log("data:", data);
    if (!data.isFile) {
      return (
        <p key={data.name}>
          {data.name} <i>{data.value}</i>
        </p>
      );
    } else {
      return (
        <a href={data.value} target="_blank">
          {data.name}
        </a>
      );
    }
  };
  setDelegatees = async () => {
    let alicePrivateKey = localStorage.getItem("alicePrivateKey");
    let aliceSigningKey = localStorage.getItem("aliceSigningKey");
    let uploader = localStorage.getItem("username");
    let aliceEthereumPrivateKey = localStorage.getItem("privateKey");
    let callingObject = {
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
    this.state.selectedDelegatees.forEach(async delegatee => {
      await grantDocumentAccess(
        this.props.documentId,
        alicePrivateKey,
        aliceSigningKey,
        delegatee,
        uploader,
        aliceEthereumPrivateKey,
        callingObject
      );
    });
  };
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
        const username = localStorage.getItem("username");
        if (delegate !== username) {
          this.setState(prevState => ({
            delegatees: [...prevState.delegatees, delegate]
          }));
        }
      }
    });
    return potentialDelegatees;
  };
  handleSelect = event => {
    const name = event.target.name;
    if (this.state.selectedDelegatees.indexOf(name) === -1) {
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
        {this.props.fetchedData
          ? null
          : [
              this.state.delegatees.length > 0 ? (
                <Button onClick={this.setDelegatees}>Grant access</Button>
              ) : null
            ]}
      </React.Fragment>
    );
  }
}

// Document.propTypes = {};
