import React, { PropTypes } from "react";
import { Row, Col, Navbar, Nav } from "react-bootstrap";
export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Row className="header">
        <Col>
          <Navbar bg="light">
            <Nav>
              <Nav.Link href="/client-app/upload"> Upload </Nav.Link>
              <Nav.Link href="/client-app/view"> view </Nav.Link>
            </Nav>
          </Navbar>
        </Col>
      </Row>
    );
  }
}

Header.propTypes = {};
