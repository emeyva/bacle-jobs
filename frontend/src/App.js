import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Users from "./UsersLanding/pages/Users";
import CompanyLP from "./CompanyLanding/pages/company";

const App = () => {
  let userRoutes;
  let companyRoutes;

  userRoutes = (
    <div>
      <MainNavigation navLinkClass="dark" />
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Router path="/company">
          <CompanyLP />
        </Router>
      </Switch>
    </div>
  );

  companyRoutes = (
    <div>
      <MainNavigation />
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Router path="/company">
          <CompanyLP />
        </Router>
      </Switch>
    </div>
  );

  return (
    <Router>
      <main>{userRoutes}</main>
    </Router>
  );
};

export default App;
