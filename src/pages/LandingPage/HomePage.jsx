import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Partnership from "./Partnership";
import Section1 from "./Section1";

const HomePage = () => {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="overflow-hidden">
        <Navbar />
        <Hero />
        <Partnership />
        <Section1 />
      </div>
    </main>
  );
};

export default HomePage;
