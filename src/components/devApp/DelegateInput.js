import React, {PropTypes} from "react";
import {Dropdown} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {connectToContract, deligateAccess} from "../../connections/web3Dev";
import {doConnections} from "../../connections/Controller";

export default class DelegateInput extends React.Component {
    state = {
        users: [],
        usersFetched: false,


    };
    setUsers = async () => {

        console.log("safas")
        await this.props.getUsers();
        console.log(this.props.listOfUsers);
        const users = this.props.listOfUsers.map( (username) => {
            return {username: username, hasAcess: false}
        });
        this.setState({users: users}, () => {
            console.log(this.state.users);
            this.setState({usersFetched: true})
        })

    };
    grantAccess = async (event, username) => {
        event.stopPropagation();
        console.log("address ======>", this.props.contractAddress)
        await connectToContract(this.props.contractAddress)

        const callingObject = {
          verifyTransaction: (
            transaction,
            gasInEth,
            transactionName,
            callback
          ) => {
            console.log("inside deligteeacesss");
            callback();
          },
          transactionMining: hash => {
            console.log("hash:", hash);
          },
          insufficientFunds: () => {
            console.log("insufficientFunds");
          }
        };
        await deligateAccess(username, localStorage.getItem('adminPrivateKey'), callingObject)

        const newUserArray = this.state.users.map(user => {
            if(user.username !== username){
                return user

            }else{
                return {...user, hasAcess: true}
            }
        })
        this.setState({users: newUserArray})
    };

    showUserList = () => {
        if (this.state.users.length > 0) {
            return (
                <Dropdown>
                    <p>Choose which users can share files on your app below</p>
                    {/*{this.props.listOfUsers.map((username =>{return <span key={username}>{username} </span>}))}*/}
                    <Dropdown.Toggle>
                        List of users
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {this.state.users.map((user, id) => {
                            return (<Dropdown.Item key={user.username}> {user.username}
                                {/*{user.username}*/}
                            {user.hasAcess ?
                                                    <FontAwesomeIcon className={'toggle-delegate-status'}
                                                                     icon={'check'}/> :
                                                    <FontAwesomeIcon className={'toggle-delegate-status'} icon={'times'}
                                                                     onClick={(event) => {
                                                                         this.grantAccess(event, user.username)
                                                                     }}/>}
                            </Dropdown.Item>)
                        })}
                    </Dropdown.Menu>

                </Dropdown>
            )
        } else {
            return (
                <p>no one is using your application right now</p>
            )
        }

    }

    render() {

        return (
            <div>
                <span onClick={this.setUsers}>get users</span>
                {this.state.usersFetched ? this.showUserList() : null}
            </div>
        );
    }
}

DelegateInput.propTypes = {};
