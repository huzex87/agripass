import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../constants/motion";
import image from "../../assets/image.png";
import { ArrowBigRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-8 pt-44 pb-16 ">
      {/* Left column */}
      <div className="w-full md:w-1/2 space-y-8">
        <motion.div
          variants={fadeIn("right", 0.2)}
          initial="hidden"
          whileInView="show"
        >
          {/* Star badge */}
          <div className="flex items-center bg-blue-800 text-white gap-2 w-fit px-4 py-2 rounded-full transition-colors cursor-pointer group">
            <span className="text-white group-hover:scale-110 transition-transform">
              ★
            </span>
            <span className="text-sm font-medium">Jump start your growth</span>
          </div>
        </motion.div>

        <motion.h1
          variants={textVariant(0.3)}
          initial="hidden"
          whileInView="show"
          className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
        >
          <span className=" text-blue-600">Disbursify</span> <br />
          is an innovative, comprehensive platform.
          <span className="inline-block ml-2 animate-pulse">⏰</span>
        </motion.h1>

        <motion.p
          variants={fadeIn("up", 0.4)}
          initial="hidden"
          whileInView="show"
          className=" text-lg md:text-xl max-w-xl"
        >
          It's designed to streamline data collection, verification, and
          disbursement of resources for government and non-governmental
          organisations (NGOs).
        </motion.p>

        <motion.div
          variants={fadeIn("up", 0.5)}
          initial="hidden"
          whileInView="show"
          className="flex gap-3 max-w-md"
        >
          <motion.div
            variants={fadeIn("up", 0.5)}
            initial="hidden"
            whileInView="show"
            className="flex items-center gap-2"
          >
            <motion.p variants={textVariant(0.3)} className="">
              As Beneficiary
            </motion.p>
            <ArrowBigRight className="text-blue-600" />
          </motion.div>
          <motion.button className=" bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-100">
            <Link to="#">Sign up</Link>
          </motion.button>
          <motion.button className="outline-blue-700 dark:outline-blue-300 outline-2 px-6 py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-500 hover:text-white text-sm font-medium transition-all duration-500 ease-in-out hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900">
            <Link to="/login/beneficiary">Sign in</Link>
          </motion.button>
        </motion.div>
      </div>

      {/* Right Column - Images */}
      <motion.div
        variants={fadeIn("left", 0.5)}
        initial="hidden"
        whileInView="show"
        className="w-full md:w-1/2 mt-16 md:mt-0 pl-0 md:pl-12"
      >
        <div className="relative">
          <img
            src={image}
            alt="Team meeting"
            className="rounded-lg relative z-10 hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
