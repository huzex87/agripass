import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../constants/motion";
import { textVariant } from "../../constants/motion";
import verification from "../../assets/verification.png";
import biometric from "../../assets/biometric.png";

const Section2 = () => {
  return (
    <section className="w-full py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          <motion.div variants={fadeIn("up", 0.3)}>
            <motion.img
              variants={fadeIn("right", 0.2)}
              src={verification}
              alt="verification"
            />
          </motion.div>

          <motion.div variants={fadeIn("up", 0.2)}>
            <motion.h1
              variants={textVariant(0.3)}
              className="text-xl/snug md:text-4xl/snug font-bold leading-tight"
            >
              By integrating robust data entry, biometric verification, unique
              token generation, geotagging, and real-time monitoring. <br />
              <span className="text-sm md:text-2xl/tight font-normal">
                Disbursify enhances resource management processes, ensurings
                equitable distribution of loans, grants, or subsidized goods.
              </span>
            </motion.h1>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Section2;
