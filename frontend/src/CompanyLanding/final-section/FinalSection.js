import React from "react";

import LandingButton from "../../shared/components/UIElements/LandingButton";
import BaclePin from "../../shared/components/UIElements/BaclePin";
import "./FinalSection.css";

const FinalSection = () => {
  return (
    <section className="final__section">
      <div className="final__section__box">
        <h1>
          <b>Pronto para recrutar?</b>
        </h1>
        <p>Recrutar novos trabalhadore com a Bacle é rápido e simples</p>
        <LandingButton>Criar Conta</LandingButton>
        <div className="bacle-pin">
          <BaclePin />
        </div>
      </div>
    </section>
  );
};

export default FinalSection;
