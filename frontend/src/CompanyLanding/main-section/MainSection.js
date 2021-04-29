import React from "react";

import LandingButton from "../../shared/components/UIElements/LandingButton";
import "./MainSection.css";

const MainSection = () => {
    return (
        <section className="main-section">
            <h6>BACLE PARA EMPRESAS</h6>
            <h2><b>Trabalhadores insuficientes é coisa do passado.</b></h2>
            <div className="h5-div">
                <h5>Encontre Trabalhadores jovens e emprenhados que procuram trabalhos não qualificados de forma rápida e simples.</h5>
            </div>
            <LandingButton>Começar</LandingButton>
        </section>
    )
}

export default MainSection;