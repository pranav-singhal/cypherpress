import React, { PropTypes } from "react";
import "../../App.scss";
import Header from "./Header";
import LoginForm from "./LoginForm";
import UploadPanel from "./UploadPanel";
import ViewPanel from "./ViewPanel";
import { Container, Row, Col } from "react-bootstrap";
import { doConnections } from "../../connections/Controller";
import { getContractAddress } from "../../connections/httpInteractions";
export default class ClientApp extends React.Component {
  state = {
    username: "",
    privateKey: "",
    panel: "UploadPanel",
    appname: ""
  };
  constructor(props) {
    super(props);
  }
  async componentWillMount() {
    console.log("ss");
    const username = localStorage.getItem("username");
    const privateKey = localStorage.getItem("privateKey");
    // const contractAddress = localStorage.getItem("contractAddress");
    const contractAddress = await getContractAddress(
      this.props.match.params.appname
    );
    // console.log("resp", resp);
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
          <LoginForm />
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
        />
        <Row>
          <Col className="title">
            <h1 className="title"> {this.state.appname}</h1>{" "}
            <span> Powered By: CypherPress</span>
          </Col>
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
