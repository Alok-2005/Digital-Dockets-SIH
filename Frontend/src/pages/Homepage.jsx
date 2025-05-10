import { useState, useEffect } from "react";
import HeroSection from "../homeComponents/HeroSection";
import ProblemSection from "../homeComponents/ProblemSection";
import SolutionSection from "../homeComponents/SolutionSection";
import BenefitsSection from "../homeComponents/BenefitsSection";
import CallToAction from "../homeComponents/CallToAction";
import Footer from "../homeComponents/Footer";

const Homepage = () => {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <CallToAction />
      <Footer />
    </main>
  );
};

export default Homepage;