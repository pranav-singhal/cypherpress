import React from "react";
import {Button, Row, Col} from "react-bootstrap";
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
import DocumentList from "./DocumentList";

export default class ViewPanel extends React.Component {
    state = {
        dataArrays: [],
        fetchingLabels: [],
        fetchedDataArrays: [],
        whichDocumentsToShow: 'myDocuments'
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
            return {name: field.fieldName, isFile: field.fieldType === "file"};
        });
        this.setState({fetchingLabels: fetchingLabels});

        const username = localStorage.getItem("username");
        const privateKey = localStorage.getItem("privateKey");

        console.log("connections done");
        fetchUploadedDocuments(
            username,
            privateKey,
            fetchingLabels,
            this.documentUploadedCallback
        );


        fetchDelegatedDouments(
            username,
            privateKey,
            bobKey,
            fetchingLabels,
            this.documentFetchedCallback
        );
    }

    documentFetchedCallback = (dataArray, documentId) => {
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
    switchDashboard = (whichDocumentsToShow) => {
        this.setState({whichDocumentsToShow: whichDocumentsToShow})
    }

    render() {

        return (
            <Row className="viewClientApp">
                <Col md={12} className={'dashboard-buttons'}>
                    <span onClick={() => {
                        this.switchDashboard('myDocuments')
                    }}
                          className={this.state.whichDocumentsToShow === 'myDocuments' ? 'active' : null}>Your Documents</span>
                    <span onClick={() => {
                        this.switchDashboard('sharedDocuments')
                    }} className={this.state.whichDocumentsToShow === 'sharedDocuments' ? 'active' : null}>Shared Documents</span>

                </Col>
                <Col className={'documents-description'}>
                    {this.state.whichDocumentsToShow === 'myDocuments' ?
                        <p>Below are the documents you have created using {this.props.appName}. Click on  <i> share this
                            document </i> &nbsp; to see people you can share it with</p>: <p>
                            Below are the documents other people have created using {this.props.appName} and shared with you
                        </p>}

                </Col>
                <Col md={12}>

                    <Col md={12}>
                        <Row>
                            {this.state.whichDocumentsToShow === 'myDocuments' ?
                                <DocumentList documentArray={this.state.dataArrays} fetchedData={false}/> :
                                <DocumentList documentArray={this.state.fetchedDataArrays} fetchedData={true}/>}

                        </Row>
                    </Col>

                </Col>

            </Row>
        );

    }
}
