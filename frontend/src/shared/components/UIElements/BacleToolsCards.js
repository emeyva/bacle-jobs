import React from "react";

import "./BacleToolsCards.css";

const BacleToolsCards = (props) => {
  return (
    <div className="bacle-tools__card">
      <div className="bacle-tools__card__icon">
        <img
          src={props.card_icon}
          alt="Tools Icon"
          className="card-icon__file"
        />
      </div>
      <div className="bacle-tools__card__title">
        <b>{props.children}</b>
      </div>
      <div className="bacle-tools__card__description">{props.description}</div>
    </div>
  );
};

export default BacleToolsCards;
