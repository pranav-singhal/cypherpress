import React, { PropTypes } from "react";
import "../../App.scss";
import Header from "./Header";
import LoginForm from "./LoginForm";
import { Container, Row, Col, Navbar, Nav } from "react-bootstrap";
export default class ClientApp extends React.Component {
  state = {
    username: ""
  };
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const username = localStorage.getItem("username");
    if (username) {
      this.setState({ username });
    }
  }

  render() {
    if (this.state.username) {
      return (
        <Container>
          <Header />
        </Container>
      );
    } else {
      return (
        <Container>
          <LoginForm />
        </Container>
      );
    }
  }
}

ClientApp.propTypes = {};
