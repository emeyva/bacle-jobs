import React from "react";

import Button from "../../shared/FormElements/Button";
import Numbers from "../components/Numbers";
import "./Users.css";

const Users = () => {
  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="column">
            <h1>
              <b>Fazer dinheiro para as tuas paixões, é na Bacle</b>
            </h1>
            <Button>Encontra trabalhos para ti</Button>
          </div>
          <div className="column"></div>
        </div>
      </div>
      <Numbers />
    </React.Fragment>
  );
};

export default Users;
