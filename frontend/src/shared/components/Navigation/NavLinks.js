import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
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

      {auth.isLoggedIn && (
        <li>
          <NavLink to="/user/u1/places">MY ACCOUNT</NavLink>
        </li>
      )}

      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/user/register" exact>
            CRIAR CONTA
          </NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/user/auth" exact>
            INICIAR SESSÃO
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>LOGOUT</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
