import React, { PropTypes } from "react";

export default class CreateAppForm extends React.Component {
  constructor(props) {
    super(props);
    this.appNameRef = React.createRef();
  }
  handleSubmit = event => {
    event.preventDefault();
    console.log(this.appNameRef);
    window.open(`/client-app/${this.appNameRef.current.value}`, "_blank");
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="enter a name for your app"
          name="appName"
          ref={this.appNameRef}
        />
        <input type="submit" />
      </form>
    );
  }
}

CreateAppForm.propTypes = {};
