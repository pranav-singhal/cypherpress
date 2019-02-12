import React, { PropTypes } from "react";
import "../../App.scss";
import Header from "./Header";
import LoginForm from "./LoginForm";
import UploadPanel from "./UploadPanel";
import ViewPanel from "./ViewPanel";
import { Container, Row, Col } from "react-bootstrap";
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
  componentWillMount() {
    const username = localStorage.getItem("username");
    const privateKey = localStorage.getItem("privateKey");
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
      <Container>
        <Header
          changePanel={panel => {
            this.setPanel(panel);
          }}
        />
        <Row>
          <Col>
            <h1 class="title"> {this.state.appname}</h1>{" "}
          </Col>
        </Row>
        {this.state.panel === "UploadPanel" ? <UploadPanel /> : <ViewPanel />}
      </Container>
    );
  }
}

ClientApp.propTypes = {};
