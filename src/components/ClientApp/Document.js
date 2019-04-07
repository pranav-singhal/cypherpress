import React from "react";
import {Form, Button, Col, Dropdown, Row} from "react-bootstrap";
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
                <div>
                    <li key={data.name + id.toString()} className="documentFields">
                        <h5>{data.name}</h5>
                        <p>
                            {data.value}
                        </p>

                    </li>

                </div>

            );
        } else {
            return (
                <div>
                    <li key={data.name + id.toString()} className="documentFields"
                        style={{display: 'inline-block', marginRight: '10px'}}>


                        <a href={data.value} target="_blank">
                            <div>
                                <FontAwesomeIcon icon="file"/>
                                <br/>
                                {data.name}
                            </div>
                        </a>


                    </li>


                </div>

            );
        }
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

    grantAcess = async (event, delegate) => {
        console.log("inside grant access")
        event.preventDefault();
        event.stopPropagation();
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
                if (item.name === delegate) {
                    item.hasAcess = true
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

                    <Row style={{minHeight: '100px'}}>
                        <Col md={10}>
                            <ul>
                                {this.props.dataArray.map((data, id) => {
                                    return this.displayData(data, id);
                                })}
                            </ul>
                        </Col>
                        <Col md={2} style={{marginTop: '20px'}}>
                            {this.props.fetchedData ? null : <Dropdown>
                                <Dropdown.Toggle>
                                    Share File
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {this.state.delegatees.map((delegate, id) => {
                                        return (
                                            <Dropdown.Item key={delegate + id.toString()}>
                                                {delegate.name}

                                                {delegate.hasAcess ?
                                                    <FontAwesomeIcon className={'toggle-delegate-status'}
                                                                     icon={'check'}/> :
                                                    <FontAwesomeIcon className={'toggle-delegate-status'} icon={'times'}
                                                                     onClick={(event) => {
                                                                         this.grantAcess(event, delegate.name)
                                                                     }}/>}

                                            </Dropdown.Item>
                                        );
                                    })}

                                </Dropdown.Menu>

                            </Dropdown>}

                        </Col>
                    </Row>


                </section>

                <hr/>
                <TransactionModal showModal={this.state.showModal}/>
            </Col>
        );
    }
}

// Document.propTypes = {};
