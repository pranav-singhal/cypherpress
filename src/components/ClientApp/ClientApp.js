import React, { PropTypes } from "react";
import "../../App.scss";
import Header from "./Header";
import LoginForm from "./LoginForm";
import UploadPanel from "./UploadPanel";
import ViewPanel from "./ViewPanel";
import { Container, Row, Col } from "react-bootstrap";
import { doConnections } from "../../connections/Controller";
import {getClientJson, getContractAddress} from "../../connections/httpInteractions";
export default class ClientApp extends React.Component {
  state = {
    username: "",
    privateKey: "",
    panel: "UploadPanel",
    appname: "",
    description:""
  };
  constructor(props) {
    super(props);
  }
  async componentWillMount() {
    console.log("ss");
    const clientAppJson = await getClientJson(this.props.match.params.appname)
    this.setState({description: clientAppJson.description })
    const username = localStorage.getItem("username");
    const privateKey = localStorage.getItem("privateKey");
    // const contractAddress = localStorage.getItem("contractAddress");
    const contractAddress = await getContractAddress(
      this.props.match.params.appname
    );
    // console.log("resp", resp);
    // const contractAddress = localStorage.getItem('contractAddress')
    await doConnections(contractAddress);
    if (username) {
      this.setState({
        username: username,
        privateKey: privateKey,
        appname: this.props.match.params.appname
      });
    }
  }
  setPanel = panel => {
    this.setState({ panel });
  };

  render() {
    if (!this.state.username) {
      return (
        <Container>
          <LoginForm appname={ this.props.match.params.appname}/>
        </Container>
      );
    }
    return (
      <Container className="clientApp">
        <Header
          className="header"
          changePanel={panel => {
            this.setPanel(panel);
          }}
          appname ={this.state.appname}
        />
        <Row>
          <Col className="title" md={12}>
            <h1 className="title"> {this.state.appname}</h1>{" "}
            <span style={{'display': 'none'}}> Powered By: <a href="/" target={'_blank'}> CypherPress</a> </span>
          </Col>


        </Row>

        <Row className={'description'}>
           <Col md={12} >
             <h4>App Description:</h4>
            <p>
            {this.state.description}
            </p>
          </Col>

          {/*<Col md={12}>*/}
          {/*  <hr/>*/}
          {/*</Col>*/}
        </Row>

        <Row>
          {this.state.panel === "UploadPanel" ? (
            <UploadPanel appName={this.props.match.params.appname} />
          ) : (
            <ViewPanel appName={this.props.match.params.appname} />
          )}
        </Row>
      </Container>
    );
  }
}

ClientApp.propTypes = {};
