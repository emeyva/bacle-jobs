import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import Users from "./UsersLanding/pages/Users";
import CompanyLP from "./CompanyLanding/pages/Company";
import CompanyAuth from "./shared/components/auth-modal/AuthModal";

const App = () => {
  let userRoutes;
  let page;
  let companyRoutes;

  const [authVisible, setAuthVisible] = useState(false);

  userRoutes = (
    <div>
      {authVisible && <CompanyAuth />}
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

  return (
    <React.Fragment>
      <Router>
        <main>{userRoutes}</main>
      </Router>
    </React.Fragment>
  );
};

export default App;
