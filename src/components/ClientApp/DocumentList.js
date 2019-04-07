import React from 'react';
import Document from "./Document";

export default class DocumentList extends React.Component {
    render() {
        return (

                this.props.documentArray.map((dataArray, id) => {
                    return (<Document
                        fetchedData={this.props.fetchedData}
                        creator ={dataArray.creator}
                        dataArray={dataArray.dataArray}
                        documentId={dataArray.documentId}
                        label={dataArray.label}
                        key={this.props.fetchedData?dataArray.name + id.toString():dataArray.documentId.toString() + id.toString()}
                    />)
                })

        )
    }
}