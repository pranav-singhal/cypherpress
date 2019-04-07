import React from 'react';
import {getClientJson, getContractAddress, getProjects} from "../../connections/httpInteractions";
import {doConnections, getUsernames} from "../../connections/Controller";
import DelegateInput from "./DelegateInput";
import {Row, Col} from 'react-bootstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class AppController extends React.Component {
    state= {
        listOfUsers: [],
        contractAddress: '',
        description:''
    }
    async componentWillMount() {
        const clientJson = await getClientJson(this.props.appName)
        let description = clientJson.description
        this.setState({description:description})

        const contractAddress = await getContractAddress(this.props.appName)
        console.log("contract address", contractAddress)
        this.setState({contractAddress: contractAddress})
        await doConnections(this.state.contractAddress)

        // const listofUsers = await getUsernames()
    // this.setState({listOfUsers: listofUsers})
    }
    // async componentDidUpdate(prevProps, prevState, snapshot) {
    //     const contractAdress = await getContractAddress(this.props.appName)
    //     console.log("contract address", contractAdress)
    //     await doConnections(contractAdress)
    //     const listofUsers = await getUsernames()
    // }
    getUsers = async () => {
        await doConnections(this.state.contractAddress)
        const listOfUsers = await getUsernames()
        console.log("list", listOfUsers)
        this.setState({listOfUsers: listOfUsers})
    }


    render() {

        return (
            <div> <h1>
                <a target={'_blank'} href={'/client-app/'+ this.props.appName}>
                    {this.props.appName}
                    <span className={'tooltip-text'}><FontAwesomeIcon icon="exclamation"/> Go to App</span>
                </a>

                </h1>
                <Row>
                    <Col md={1}/>
                    <Col md={10} className={'app-description'}>
                        <p>{this.state.description}</p>
                    </Col>
                    <Col md={1}/>
                </Row>

                <DelegateInput getUsers={this.getUsers} listOfUsers = {this.state.listOfUsers} contractAddress ={this.state.contractAddress}/>


            </div>

        )
    }
}