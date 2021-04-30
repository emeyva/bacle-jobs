import React from "react";

import StepRow from "../../../shared/components/UIElements/StepRow";
import step1 from "../../../shared/assets/img/step1.png";
import "./StepsSection.css";

const StepsSection = () => {
  return (
    <section className="steps-bacle__section">
      <StepRow
        step_img={step1}
        overline="OVERLINE"
        description="The skeleton plan of a website can be brokendown into three components: information design, navigation design, and interface design"
        button={false}
      >
        1. Cria um perfil
      </StepRow>
      <StepRow
        className="step-row__inverse"
        step_img={step1}
        overline="OVERLINE"
        description="The skeleton plan of a website can be brokendown into three components: information design, navigation design, and interface design"
        button={false}
      >
        2. Procura e candidata-te a uma vaga perto de ti
      </StepRow>
      <StepRow
        step_img={step1}
        overline="OVERLINE"
        description="The skeleton plan of a website can be brokendown into three components: information design, navigation design, and interface design"
        button={true}
      >
        3. Começa o trabalho
      </StepRow>
    </section>
  );
};

export default StepsSection;
