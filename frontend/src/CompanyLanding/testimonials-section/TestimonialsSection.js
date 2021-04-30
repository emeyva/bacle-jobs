import React from "react";
import TetsimonialsCard from "../../shared/components/UIElements/TestimonialCard";

import TestimonialCard from "../../shared/components/UIElements/TestimonialCard";
import "./TestimonialsSection.css";

const TestimonialsSection = () => {
  return (
    <section className="testimonials__section">
      <div className="testimonials__text">
        <h3>
          <b>Testemunhos</b>
        </h3>
        <p>
          Pessoas que represntam empresas ou associações que já colaboraram com
          a nossa equipa ou são nossas clientes sempre que necessitam de
          recrutar novos trabalhadores
        </p>
      </div>
      <div className="testimonials__cards-list">
        <TetsimonialsCard />
        <div className="separator" />
        <TetsimonialsCard />
      </div>
    </section>
  );
};

export default TestimonialsSection;
