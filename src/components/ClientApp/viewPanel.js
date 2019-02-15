import React, { PropTypes } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import {
  fetchUploadedDocuments,
  doConnections
} from "../../connections/Controller";
export default class ViewPanel extends React.Component {
  state = {
    fetchingLabels: []
  };

  async componentWillMount() {
    console.log("view panel mounted");
    let clientAppJson = localStorage.getItem("clientAppJson");
    clientAppJson = JSON.parse(clientAppJson);
    const dataInfo = clientAppJson.dataInfo;
    const fetchingLabels = dataInfo.map(field => {
      // select isFile based on field.fieldType
      return { name: field.fieldName, isFile: false };
    });
    this.setState({ fetchingLabels: fetchingLabels });

    const contractAddress = localStorage.getItem("contractAddress");
    const username = localStorage.getItem("username");
    const privateKey = localStorage.getItem("privateKey");
    const alicePrivateKey = localStorage.getItem("alicePrivateKey");
    // await doConnections(contractAddress);
    // console.log("connections done");
    await fetchUploadedDocuments(
      username,
      privateKey,
      alicePrivateKey,
      fetchingLabels,
      this.documentUploadedCallback
    );
  }
  documentUploadedCallback = async (dataArray, documentId) => {
    console.log(dataArray, documentId);
  };

  componentDidMount() {}
  render() {
    return (
      <Row>
        <Col>
          <div> View Panel</div>
        </Col>
      </Row>
    );
  }
}
