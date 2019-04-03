import React from "react";
import { Form, Button, Col } from "react-bootstrap";
import {
  getDelegatees,
  isDelegatee,
  grantDocumentAccess
} from "../../connections/Controller";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TransactionModal from "../TransactionModal";
export default class Document extends React.Component {
  state = {
    delegatees: [],
    selectedDelegatees: [],
    flipped: false,
    showModal: false
  };

  async componentDidMount() {
    console.log(this.props.dataArray);
    if (!this.props.fetchedData) {
      await this.fetchDelegatees();
    }
  }
  displayData = (data, id) => {
    if (!data.isFile) {
      return (
        <li key={data.name + id.toString()} className="documentFields">
          <h5>{data.name}</h5> : <i>{data.value}</i>
        </li>
      );
    } else {
      return (
        <li key={data.name + id.toString()} className="documentFields">
          File : &nbsp;
          <a href={data.value} target="_blank">
            <FontAwesomeIcon icon="link" />
            {data.name}
          </a>
        </li>
      );
    }
  };
  setDelegatees = async () => {
    let aliceKey = localStorage.getItem("aliceKey");
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
      this.setState({ showModal: true });
      await grantDocumentAccess(
        localStorage.getItem('password'),
        delegatee,
        uploader,
        aliceKey,
        this.props.label,
        this.props.documentId,
        aliceEthereumPrivateKey,
        callingObject
      );
      this.setState({ showModal: false });
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
  flip = () => {
    this.setState(prevState => ({ flipped: !prevState.flipped }));
    console.log(this.state.flipped);
  };
  render() {
    return (
      <Col md={3} className="document">
        <section class="container">
          <div
            className={this.state.flipped ? "card flipped" : "card flipper"}
            onClick={this.flip}
          >
            <div class="front">
              <ul>
                {this.props.dataArray.map((data, id) => {
                  return this.displayData(data, id);
                })}
              </ul>
            </div>
            <div class="back">
              <h5>Select the delegates from below</h5>

              <br />
              <ul>
                {this.state.delegatees.map((delegate, id) => {
                  return (
                    <Form.Check
                      type="checkbox"
                      label={delegate}
                      key={delegate + id.toString()}
                      name={delegate}
                      onChange={this.handleSelect}
                    />
                  );
                })}
              </ul>
              {this.props.fetchedData
                ? null
                : [
                    this.state.delegatees.length > 0 ? (
                      <Button onClick={this.setDelegatees}>Grant access</Button>
                    ) : null
                  ]}
            </div>
          </div>
        </section>

        <hr />
        <TransactionModal showModal={this.state.showModal} />
      </Col>
    );
  }
}

// Document.propTypes = {};
