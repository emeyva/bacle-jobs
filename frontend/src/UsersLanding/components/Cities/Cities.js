import React from "react";

import lisboa from "../../../shared/assets/img/Lisboa.jpg";
import porto from "../../../shared/assets/img/Porto.jpg";
import albufeira from "../../../shared/assets/img/Albufeira.jpg";

import CardCities from "../Cities/CardCities";
import "./Cities.css";

const Cities = () => {
  return (
    <section className="section-cities">
      <div className="cities-text">
        <h1>
          <b>Cidades Populares</b>
        </h1>
      </div>
      <div className="cities-description">
        <h5>
          As cidades com mais trabalhos disponíveis e com mais procura por parte
          dos users
        </h5>
      </div>
      <div className="card-cities__wrapper">
        <CardCities
          img={lisboa}
          title="Lisboa"
          description="Mais de 1000 trabalhos disponíveis "
        />
        <CardCities
          img={porto}
          title="Porto"
          description="Mais de 1000 trabalhos disponíveis "
        />
        <CardCities
          img={albufeira}
          title="Faro"
          description="Mais de 1000 trabalhos disponíveis "
        />
      </div>
      <div className="cities-final__div">
        <a href="" className="cities-final__text">
          Todas as cidades
        </a>
      </div>
    </section>
  );
};

export default Cities;
