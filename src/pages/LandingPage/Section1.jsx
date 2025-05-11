import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../constants/motion";
import { textVariant } from "../../constants/motion";
import illustration from "../../assets/illustration.png"; // Adjust the path as necessary

const Section1 = () => {
  return (
    <section className="w-full bg-gray-50 py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          <motion.div variants={fadeIn("down", 0.2)}>
            <motion.h1
              variants={textVariant(0.2)}
              className="text-xl/snug md:text-4xl/snug font-extralight leading-tight"
            >
              It addresses critical efficiency, transparency, and accountability
              gaps when managing large-scale disbursement programs targeting
              individuals, cooperatives, and associations.
            </motion.h1>
          </motion.div>

          <motion.div
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            whileInView="show"
          >
            <motion.img
              variants={fadeIn("up", 0.2)}
              src={illustration}
              alt="Placeholder"
              className="w-full"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Section1;
