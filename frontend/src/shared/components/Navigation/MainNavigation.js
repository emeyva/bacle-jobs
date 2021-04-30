import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import "./MainNavigation.css";

const MainNavigation = () => {
  let location = useLocation();
  console.log(location.pathname);

  return (
    <React.Fragment>
      <MainHeader>
        <nav className="main-navigation__header-nav">
          <NavLinks navLinkClass={location.pathname == "/company" ? "light" : "dark"} />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
