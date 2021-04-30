import React from "react";

import audaxLogo from "../../assets/img/audax.png";
import TioDudubi from "../../assets/img/dudubi.png";
import "./TestimonialCard.css";

const TetsimonialsCard = () => {
    return (
        <div className="testimonial__card">
            <div className="testimonial__card__icon">
                <img src={TioDudubi} alt="tio dudubi" />
            </div>
            <div className="testimonial__card__text">
                <p>The visual guide will prive a view to the costumer of what their website or project will end up looking like. It ensures that they are kept up to date on any developments and changes made to the structure or visuals</p>
            </div>
            <div className="testimonial__card__name">
                <h4><b>Maria João</b></h4>
            </div>
            <div className="testimonial__card__logo">
                <img src={audaxLogo} alt="Audax ISCTE" />
            </div>
        </div>
    )
}

export default TetsimonialsCard;