import React from "react";

import WhyBacleCard from "../../shared/components/UIElements/WhyBacleCard";
import "./WhyBacleSection.css";
import icon from "../../shared/assets/img/bacle-icon.png";

const WhyBacleSection = () => {
    return(
    <section className="why-bacle__section">
        <div className="why-bacle__text">
            <h3><b>Porquê a Bacle Jobs?</b></h3>
            <p>Razões pelas quais empresas escolhem a bacle para encontrar o melhor talento jovem em Portugal</p>
        </div>
        <div className="why-bacle__cards">
            <WhyBacleCard description="Liberdade total de preço à hora. Compare com outros trabalhos na região." card_icon={icon}>Pagamentos Fléxiveis</WhyBacleCard>
            <WhyBacleCard description="Nunca fique sem trabalhadores mesmo quando a sua primeira escolha cancela." card_icon={icon}>Trabalhadores Suplentes</WhyBacleCard>
            <WhyBacleCard description="User interface design includes selecting and arranging interface elements" card_icon={icon}>Feature three</WhyBacleCard>
            <WhyBacleCard description="User interface design includes selecting and arranging interface elements" card_icon={icon}>Feature four</WhyBacleCard>
            <WhyBacleCard description="User interface design includes selecting and arranging interface elements" card_icon={icon}>Feature five</WhyBacleCard>
            <WhyBacleCard description="User interface design includes selecting and arranging interface elements" card_icon={icon}>Feature six</WhyBacleCard>
        </div>
    </section>)
}

export default WhyBacleSection;