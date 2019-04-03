import React from "react";
import { Button, Row, Col } from "react-bootstrap";
import {
  getClientJson,
  getContractAddress
} from "../../connections/httpInteractions";
import Document from "./Document";
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
    console.log("view panel ksj");
    let clientAppJson = await getClientJson(this.props.appName);
    const bobKey = localStorage.getItem('bobKey')
    console.log(clientAppJson)
    // clientAppJson = JSON.parse(localStorage.getItem('clientAppJson'));
    console.log("clientAppJson:", clientAppJson);
    const dataInfo = clientAppJson.dataInfo;
    console.log(dataInfo);
    const contractAddress = await getContractAddress(this.props.appName);
    console.log('contract address', contractAddress)
    // const contractAddress = localStorage.getItem('contractAddress');
    await doConnections(contractAddress);

    const fetchingLabels = dataInfo.map(field => {
      // select isFile based on field.fieldType
      console.log("viewpanel27", field.fieldType);
      return { name: field.fieldName, isFile: field.fieldType === "file" };
    });
    this.setState({ fetchingLabels: fetchingLabels });

    const username = localStorage.getItem("username");
    const privateKey = localStorage.getItem("privateKey");
    const alicePrivateKey = localStorage.getItem("alicePrivateKey");
    const alicePublicKey = localStorage.getItem("alicePublicKey");

    console.log("connections done");
    fetchUploadedDocuments(
      username,
      privateKey,
      fetchingLabels,
      this.documentUploadedCallback
    );
    // console.log(
    //   await getJson("QmdPwKejYqXkpxBZwWFzttsR7Mx4SAVgXzabyWrkgmYBQu")
    // );

    fetchDelegatedDouments(
      username,
      privateKey,
      bobKey,
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
  documentUploadedCallback = async (dataArray, documentId, label) => {
    console.log(dataArray, documentId);
    this.setState(prevState => ({
      dataArrays: prevState.dataArrays.concat([
        {
          dataArray: dataArray,
          documentId: documentId,
          label: label
        }
      ])
    }));
  };

  render() {
    return (
      <Row className="viewClientApp">
        <Col md={12}>
          <div>
            {" "}
            <h1> Documents you have uploaded </h1>
          </div>
          <Col>
            <Col md={12}>
              <Row>
                {this.state.dataArrays.map((dataArray, id) => {
                  return (
                    <Document
                      fetchedData={false}
                      dataArray={dataArray.dataArray}
                      documentId={dataArray.documentId}
                      label = {dataArray.label}
                      key={dataArray.documentId.toString() + id.toString()}
                    />
                  );
                })}
              </Row>
            </Col>
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
