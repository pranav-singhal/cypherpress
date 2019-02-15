import React, { PropTypes } from "react";

export default class Document extends React.Component {
  state = {};
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log(this.props.dataArray);
  }
  displayData = data => {
    if (!data.isFile) {
      return (
        <p key={data.name}>
          {data.name} <i>{data.value}</i>
        </p>
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.props.dataArray.map((data, id) => {
          return this.displayData(data);
        })}
      </React.Fragment>
    );
  }
}

// Document.propTypes = {};
