import React from "react";

import LandingButton from "./LandingButton";
import "./StepRow.css";

const StepRow = (props) => {
  return (
    <div className={`step-row ${props.className}`}>
      <div className="step-left">
        <img
          src={props.step_img}
          alt="Bacle Icon"
        />
      </div>
      <div className="step-right">
          <h5>{props.overline}</h5>
          <h1><b>{props.children}</b></h1>
          <p>{props.description}</p>
          { props.button && <LandingButton className="white-text">Criar Conta</LandingButton>}
      </div>
    </div>
  );
};

export default StepRow;
