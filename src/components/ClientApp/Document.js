import React from "react";
import {Form, Button, Col, Dropdown} from "react-bootstrap";
import {
    getDelegatees,
    isDelegatee,
    grantDocumentAccess
} from "../../connections/Controller";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
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
                    <h5>{data.name}</h5>
                    <p>
                        {data.value}
                    </p>

                </li>
            );
        } else {
            return (
                <li key={data.name + id.toString()} className="documentFields">
                    File : &nbsp;
                    <a href={data.value} target="_blank">
                        <FontAwesomeIcon icon="link"/>
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
            this.setState({showModal: true});
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
            this.setState({showModal: false});
        });
    };
    fetchDelegatees = async () => {
        const allDelegatees = await getDelegatees();
        // let potentialDelegatees = [];
        allDelegatees.forEach(async delegate => {
            // console.log("delegate:", delegate);
            // let bool = await isDelegatee(this.props.documentId, delegate);
            // if (bool) {
            //     return;
            // } else {
            //     potentialDelegatees.push(delegate);
                const username = localStorage.getItem("username");
                if (delegate !== username) {
                    let hasAcess = await isDelegatee(this.props.documentId, delegate);
                    this.setState(prevState => ({
                        delegatees: [...prevState.delegatees, {name: delegate, hasAcess: hasAcess}]
                    }));
                }
            // }
        });
        return allDelegatees;
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
            this.setState({selectedDelegatees: newDelegates});
        }
    };
    grantAcess  = async  (event,delegate) =>{
        console.log("inside grant access")
        event.preventDefault()
        console.log("delegate", delegate)
        let aliceKey = localStorage.getItem("aliceKey");
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
        this.setState({showModal: true});
        await grantDocumentAccess(
                localStorage.getItem('password'),
                delegate,
                uploader,
                aliceKey,
                this.props.label,
                this.props.documentId,
                aliceEthereumPrivateKey,
                callingObject
            );
        console.log("end of grant access")
        this.setState(prevState => {
            prevState.delegatees.forEach(item => {
                if(item.name === delegate){
                    item.hasAcess  = true
                }
            });
            return prevState;
        })

        this.setState({showModal: false});


    }
    revokeAcess = async () => {
        let aliceKey = localStorage.getItem("aliceKey");
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
    }



    render() {
        return (
            <Col md={12} className="document">
                <section class="container">


                    <ul>
                        {this.props.dataArray.map((data, id) => {
                            return this.displayData(data, id);
                        })}
                    </ul>
                    <Dropdown>
                        <Dropdown.Toggle>
                            Share File
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {this.state.delegatees.map( (delegate, id) => {
                            return (
                                <Dropdown.Item key={delegate + id.toString()}>
                                    {delegate.name}

                                    {/*{console.log(delegate,await isDelegatee(this.props.documentId,delegate))}*/}
                                    { delegate.hasAcess? <FontAwesomeIcon className={'toggle-delegate-status'} icon={'check'}  />: <FontAwesomeIcon className={'toggle-delegate-status'} icon={'times'} onClick={(event) => {this.grantAcess(event,delegate.name)}} />}

                                </Dropdown.Item>
                            );
                        })}

                        </Dropdown.Menu>

                    </Dropdown>

                    {/*{this.props.fetchedData*/}
                    {/*    ? null*/}
                    {/*    : [*/}
                    {/*        this.state.delegatees.length > 0 ? (*/}
                    {/*            <Button onClick={this.setDelegatees}>Grant access</Button>*/}
                    {/*        ) : null*/}
                    {/*    ]}*/}


                </section>

                <hr/>
                <TransactionModal showModal={this.state.showModal}/>
            </Col>
        );
    }
}

// Document.propTypes = {};
