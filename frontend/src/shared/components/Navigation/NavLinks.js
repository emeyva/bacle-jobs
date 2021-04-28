import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

import Button from "../../FormElements/Button";
import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <div className="nav-links__div">
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
      <div className="nav-links__center">
        <li>
          <h1 className="main-navigation__title">
            <Link to="/">BACLE</Link>
          </h1>
        </li>
      </div>

      <div className="nav-links__div">
        {auth.isLoggedIn && (
          <li>
            <NavLink to="/user/u1/places">MY ACCOUNT</NavLink>
          </li>
        )}

        {!auth.isLoggedIn && (
          <li>
            <NavLink to="/user/auth" exact>
              INICIAR SESSÃO
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
              CRIAR CONTA
            </NavLink>
          </li>
        )}
        {auth.isLoggedIn && (
          <li>
            <button onClick={auth.logout}>LOGOUT</button>
          </li>
        )}
      </div>
    </ul>
  );
};

export default NavLinks;
