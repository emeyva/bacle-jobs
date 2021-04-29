import React from "react";

import "./WhyBacleCard.css";

const WhyBacleCard = (props) => {
  return (
    <div className="why-bacle__card">
      <div className="why-bacle__card__icon">
        <img
          src={props.card_icon}
          alt="Bacle Icon"
          className="card-icon__file"
        />
      </div>
      <div className="why-bacle__card__title">
        <h2>
          <b>{props.children}</b>
        </h2>
      </div>
      <div className="why-bacle__card__icon__description">
        {props.description}
      </div>
    </div>
  );
};

export default WhyBacleCard;
