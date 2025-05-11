import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Partnership from "./Partnership";
import Section1 from "./Section1";
import Section2 from "./Section2";
import FeatureSection from "./FeatureSection";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="overflow-hidden">
        <Navbar />
        <Hero />
        <Partnership />
        <Section1 />
        <Section2 />
        <FeatureSection />
        <Footer />
      </div>
    </main>
  );
};

export default HomePage;
