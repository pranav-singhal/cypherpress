import React, { PropTypes } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import {
  getClientJson,
  getContractAddress
} from "../../connections/httpInteractions";
import Document from "./Document";
import { getJson } from "../../connections/ipfsInteractions";
import {
  fetchUploadedDocuments,
  doConnections,
  fetchDelegatedDouments
} from "../../connections/Controller";
export default class ViewPanel extends React.Component {
  state = {
    dataArrays: [],
    fetchingLabels: [],
    fetchedDataArrays: []
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

    const contractAddress = await getContractAddress(this.props.appName);
    const username = localStorage.getItem("username");
    const privateKey = localStorage.getItem("privateKey");
    const alicePrivateKey = localStorage.getItem("alicePrivateKey");
    const alicePublicKey = localStorage.getItem("alicePublicKey");
    await doConnections(contractAddress);
    console.log("connections done");
    fetchUploadedDocuments(
      username,
      privateKey,
      alicePrivateKey,
      fetchingLabels,
      this.documentUploadedCallback
    );
    // console.log(
    //   await getJson("QmdPwKejYqXkpxBZwWFzttsR7Mx4SAVgXzabyWrkgmYBQu")
    // );
    fetchDelegatedDouments(
      username,
      privateKey,
      alicePublicKey,
      alicePrivateKey,
      fetchingLabels,
      this.documentFetchedCallback
    );
  }
  documentFetchedCallback = (dataArray, documentId) => {
    console.log("inside doucmentFetchedCallback");
    console.log(dataArray, documentId);
    this.setState(prevState => ({
      fetchedDataArrays: prevState.fetchedDataArrays.concat([
        {
          dataArray: dataArray,
          documentId: documentId
        }
      ])
    }));
  };
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
        <Col md={12}>
          <div>
            {" "}
            <h1> Documents you have uploaded </h1>
          </div>
          <Col>
            {this.state.dataArrays.map((dataArray, id) => {
              return (
                <Document
                  fetchedData={false}
                  dataArray={dataArray.dataArray}
                  documentId={dataArray.documentId}
                  key={dataArray.documentId}
                />
              );
            })}
          </Col>
        </Col>
        <Col md={12}>
          <div>
            {" "}
            <h1> Documents you have acess to </h1>
          </div>
          {this.state.fetchedDataArrays.map((dataArray, id) => {
            return (
              <Document
                fetchedData={true}
                dataArray={dataArray.dataArray}
                documentId={dataArray.documentId}
                key={dataArray.name + id.toString()}
              />
            );
          })}
        </Col>
      </Row>
    );
  }
}
