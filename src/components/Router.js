import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App";

import ClientApp from "./ClientApp/ClientApp";
const Router = props => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/client-app/:appname" component={ClientApp} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
