import { useState, useEffect } from "react";
import HeroSection from "../homeComponents/HeroSection";
import ProblemSection from "../homeComponents/ProblemSection";
import SolutionSection from "../homeComponents/SolutionSection";
import BenefitsSection from "../homeComponents/BenefitsSection";
import CallToAction from "../homeComponents/CallToAction";

const Homepage = () => {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <CallToAction />
    </main>
  );
};

export default Homepage;