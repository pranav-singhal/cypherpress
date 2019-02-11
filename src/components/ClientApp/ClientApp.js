import React, { PropTypes } from "react";
import "../../App.scss";
export default class ClientApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div id="test">{this.props.match.params.appname}</div>;
  }
}

ClientApp.propTypes = {};
