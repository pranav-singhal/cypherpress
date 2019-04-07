import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import App from "./App";

import ClientApp from "./ClientApp/ClientApp";
import CreateAppForm from "./devApp/CreateAppForm";
import AdminApps from "./devApp/AdminApps";
const Router = props => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route path="/client-app/:appname" component={ClientApp} />
        <Route path="/create-new-app" component={CreateAppForm} />
        <Route path="/admin-apps" component={AdminApps} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
