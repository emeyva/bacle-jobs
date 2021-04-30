import React from "react";

import MainSection from "../main-section/MainSection";
import WhyBacleSection from "../why-bacle-section/WhyBacleSection";
import BacleToolsSection from "../bacle-tools-section/BacleToolsSection";
import StepsSection from "../steps-section/SetpsSection";
import TestimonialsSection from "../testimonials-section/TestimonialsSection";
import FinalSection from "../final-section/FinalSection";
import Footer from "../footer/Footer";
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
