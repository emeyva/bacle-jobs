import React from "react";

import BacleToolsCards from "../../shared/components/UIElements/BacleToolsCards";
import tool_icon from "../../shared/assets/img/tools-icon.png";
import "./BacleToolsSection.css";

const BacleToolsSection = () => {
    return (
        <section className="bacle-tools__section">
            <div className="bacle-tools__text">
                <h3><b>Ferramentas de sucesso</b></h3>
                <p>Ferramentas que o ajudarão no processo de recrutamento fazendo com que recrutar novos trabalhadores seja um processo simples e eficaz.</p>
            </div>
            <div className="bacle-tools__cards">
                <BacleToolsCards description="A website wireframe, also known as a page schematic or screen blueprint, is a visual" card_icon={tool_icon}>Analytics</BacleToolsCards>
                <BacleToolsCards description="A website wireframe, also known as a page schematic or screen blueprint, is a visual" card_icon={tool_icon}>Geo-Location</BacleToolsCards>
                <BacleToolsCards description="A website wireframe, also known as a page schematic or screen blueprint, is a visual" card_icon={tool_icon}>Messaging</BacleToolsCards>
                <BacleToolsCards description="A website wireframe, also known as a page schematic or screen blueprint, is a visual" card_icon={tool_icon}>Gamification</BacleToolsCards>
            </div>
        </section>
    )
}

export default BacleToolsSection;