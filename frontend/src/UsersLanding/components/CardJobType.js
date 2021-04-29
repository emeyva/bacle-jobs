import React from "react";

import "./CardJobType.css";

const CardJobType = (props) => {
  return (
    <div className="card-jobtype">
      <div className="card-jobtype__icon">
        <img src={props.icon} />
      </div>
      <div className="card-jobtype__title">
        <h3>
          <b>{props.title}</b>
        </h3>
      </div>
      <div className="card-jobtype__description">{props.description}</div>
    </div>
  );
};

export default CardJobType;
