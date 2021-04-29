import React from "react";

import "./JobType.css";

import CardJobType from "./CardJobType";

const JobType = () => {
  return (
    <section className="section-jobtype">
      <div className="jobtype-text">
        <h1>
          <b>Um trabalho à tua medida</b>
        </h1>
      </div>
      <div className="jobtype-description">
        <h5>
          Encontra o trabalho ideal para ti. A Bacle oferece-te trabalhos em
          regime part-time, full-time e ainda de extras. Atreves-te a explorar?
        </h5>
      </div>
      <div className="card-jobtype__wrapper">
        <CardJobType
          icon={
            "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
          }
          title={"Full-time"}
          description={"Podes pesquisar por trabalhos full-time"}
        />
        <CardJobType
          icon={
            "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
          }
          title={"Part-time"}
          description={"Podes pesquisar por trabalhos part-time"}
        />
        <CardJobType
          icon={
            "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
          }
          title={"Extras"}
          description={"Podes pesquisar por trabalhos extra"}
        />
      </div>
    </section>
  );
};

export default JobType;
