import React from "react";
import { Jumbotron, Row, Col, Button } from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import TransactionModal from "./TransactionModal";
export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Jumbotron className="jumbotron">
        <Row>
          <Col md={12}>
            <h1 className="main">CypherPress</h1>
          </Col>
          <Col md={4} />
          <Col md={4}>
            <p>
              The WYSIWYG for NuCypher + IPFS
              <i className="fab fa-github"></i>
            </p>
            <p>  asdfasdf</p>
          </Col>
        </Row>
        <Row>
          <Col md={4} />
          <Col md={4}>
            <Button className="button" onClick={this.props.mountApp}>
              Get Started
            </Button>
          </Col>
        </Row>
      </Jumbotron>
    );
  }
}
