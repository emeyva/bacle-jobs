import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

import Button from "../../FormElements/Button";
import { AuthContext } from "../../context/auth-context";
import logo from "../../assets/img/logo-bacle.png";
import whiteLogo from "../../assets/img/logo-bacle_white.png";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  const [navLinkClasses, setNavLinkClasses] = useState("dark");
  const [navLinkDivClasses, setNavLinkDivClasses] = useState("dark");

  useEffect(() => {
    console.log(props.navLinkClass);
    props.navLinkClass === "light"
      ? setNavLinkClasses("nav-links_company")
      : setNavLinkClasses("nav-links");
    
    props.navLinkClass === "light"
      ? setNavLinkDivClasses("nav-link__side-divs__company")
      : setNavLinkDivClasses("nav-link__side-divs");
  }, [props.navLinkClass]);

  return (
    <ul className={navLinkClasses}>
      <div className={navLinkDivClasses}>
        <li>
          <NavLink to="/sobre" exact>
            Sobre Nós
          </NavLink>
        </li>
        <li>
          <NavLink to="/company" exact>
            Para Empresas
          </NavLink>
        </li>
      </div>
      <li>
        <div className="nav-logo__div">
          <Link to="/" className="nav-logo">
            <img src={props.navLinkClass === "light" ? whiteLogo : logo} alt="Bacle Jobs" className="nav-logo__img" />
          </Link>
        </div>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/user/u1/places">MY ACCOUNT</NavLink>
        </li>
      )}

      <div className="nav-link__side-divs">
        {!auth.isLoggedIn && (
          <li>
            <NavLink to="/user/auth" exact>
              Iniciar Sessão
            </NavLink>
          </li>
        )}
        {!auth.isLoggedIn && (
          <li>
            <NavLink
              to="/user/register"
              exact
              className="landing-button_account"
            >
              <b>Criar Conta</b>
            </NavLink>
          </li>
        )}
      </div>
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
