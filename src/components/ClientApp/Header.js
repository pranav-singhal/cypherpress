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
            <Nav as="ul">
              <Nav.Item as="li">
                <Nav.Link eventKey="disabled">
                  {" "}
                  Welcome {localStorage.getItem("username")}{" "}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  onClick={e => {
                    this.props.changePanel("UploadPanel");
                  }}
                >
                  {" "}
                  Upload{" "}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  onClick={e => {
                    this.props.changePanel("ViewPanel");
                  }}
                >
                  {" "}
                  view{" "}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar>
        </Col>
      </Row>
    );
  }
}

Header.propTypes = {};
