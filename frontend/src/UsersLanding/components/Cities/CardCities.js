import React from "react";

import "./CardCities.css";

const CardCities = (props) => {
  return (
    <div className="card-cities">
      <div className="card-cities-wrapper">
        <div className="card-cities__img">
          <img src={props.img} />
        </div>
        <div className="card-cities__footer__border">
          <div className="card-cities__title">
            <h2>
              <b>{props.title}</b>
            </h2>
          </div>
          <div className="card-cities__description">{props.description}</div>
        </div>
      </div>
    </div>
  );
};

export default CardCities;
