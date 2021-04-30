import React from "react";

import MainSection from "../main-section/MainSection";
import WhyBacleSection from "../why-bacle-section/WhyBacleSection";
import BacleToolsSection from "../bacle-tools-section/BacleToolsSection";
<<<<<<< HEAD
import StepsSection from "../steps-section/SetpsSection";
import TestimonialsSection from "../testimonials-section/TestimonialsSection";
import FinalSection from "../final-section/FinalSection";
import Footer from "../footer/Footer";
=======
import StepsSection from "../steps-section/StepsSection";
>>>>>>> ccf8b6e6523609de6a3ffd90080364586b1d6887
import "./Company.css";

const CompanyLP = () => {
  return (
    <div className="company-landing-page">
      <MainSection />
      <WhyBacleSection />
      <BacleToolsSection />
      <StepsSection />
      <TestimonialsSection />
      <FinalSection />
      <Footer />
    </div>
  );
};

export default CompanyLP;
