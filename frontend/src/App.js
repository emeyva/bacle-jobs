import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Users from "./UsersLanding/pages/Users";
import Company from "./CompanyLanding/pages/company";

const App = () => {
  let routes;

  routes = (
    <Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Router path="/company">
        <Company />
      </Router>
    </Switch>
  );

  return (
    <Router>
      <MainNavigation />
      <main>{routes}</main>
    </Router>
  );
};

export default App;
