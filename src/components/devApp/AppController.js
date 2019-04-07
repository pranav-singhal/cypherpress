import React from 'react';
import {getContractAddress, getProjects} from "../../connections/httpInteractions";
import {doConnections, getUsernames} from "../../connections/Controller";
import DelegateInput from "./DelegateInput";


export default class AppController extends React.Component {
    state= {
        listOfUsers: [],
        contractAddress: ''
    }
    async componentWillMount() {

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
                {this.props.appName}
                </h1>
                <DelegateInput getUsers={this.getUsers} listOfUsers = {this.state.listOfUsers} contractAddress ={this.state.contractAddress}/>
                {/*<span onClick={this.getUsers}>get users</span>*/}

            </div>

        )
    }
}