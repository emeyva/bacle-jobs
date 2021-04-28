import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";

import Button from "../../FormElements/Button";
import { AuthContext } from "../../context/auth-context";
import logo from "../../assets/img/logo-bacle.png";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <div className="nav-link__side-divs">
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
                <img src={logo} alt="Bacle Jobs" className="nav-logo__img" />
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
