import React, { PropTypes } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { getClientJson } from "../../connections/httpInteractions";
import Document from "./Document";
import {
  fetchUploadedDocuments,
  doConnections
} from "../../connections/Controller";
export default class ViewPanel extends React.Component {
  state = {
    dataArrays: [],
    fetchingLabels: []
  };

  async componentDidMount() {
    console.log("view panel mounted");
    const clientAppJson = await getClientJson(this.props.appName);
    console.log("clientAppJson:", clientAppJson);
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
    fetchUploadedDocuments(
      username,
      privateKey,
      alicePrivateKey,
      fetchingLabels,
      this.documentUploadedCallback
    );
  }
  documentUploadedCallback = async (dataArray, documentId) => {
    console.log(dataArray, documentId);
    this.setState(prevState => ({
      dataArrays: prevState.dataArrays.concat([
        {
          dataArray: dataArray,
          documentId: documentId
        }
      ])
    }));
  };

  render() {
    return (
      <Row>
        <Col>
          <div> Documents you have uploaded</div>
          <Col>
            {this.state.dataArrays.map((dataArray, id) => {
              return (
                <Document
                  dataArray={dataArray.dataArray}
                  documentId={dataArray.documentId}
                  key={dataArray.documentId}
                />
              );
            })}
          </Col>
        </Col>
      </Row>
    );
  }
}
