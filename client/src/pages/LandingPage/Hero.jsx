import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../constants/motion";
import image2 from "../../assets/image2.png";
import { ArrowRight, User, ShieldCheck, Leaf } from "lucide-react";

const Hero = () => {
  return (
    <div className="bg-slate-950 text-white min-h-screen flex items-center pt-24 pb-16 relative overflow-hidden">
      
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <section className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        
        {/* Left Column Text details */}
        <div className="space-y-8 max-w-2xl">
          <motion.div
            variants={fadeIn("right", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Leaf size={12} /> Jumpstart Your Growth
            </div>
          </motion.div>

          <motion.h1
            variants={textVariant(0.3)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-white"
          >
            Streamlined <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Input Distribution
            </span> <br />
            & Repayments
          </motion.h1>

          <motion.p
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-slate-400 text-base md:text-lg leading-relaxed font-medium"
          >
            AgriPass bridges the gap between agricultural cooperatives, field agents, and smallholder farmers. Monitor land boundaries, manage input vouchers, and schedule non-interest Shariah repayments dynamically.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            variants={fadeIn("up", 0.5)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-wrap gap-4 pt-2"
          >
            {/* Farmer Access */}
            <Link
              to="/login/beneficiary"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/30"
            >
              <User size={14} /> Farmer Portal
            </Link>

            {/* Cooperative login */}
            <Link
              to="/signin"
              className="px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <ShieldCheck size={14} className="text-emerald-400" /> Cooperative Access
            </Link>
          </motion.div>

        </div>

        {/* Right Column - Premium image frame */}
        <motion.div
          variants={fadeIn("left", 0.5)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative w-full aspect-video lg:aspect-square max-w-md mx-auto"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 opacity-20 blur-xl scale-95 pointer-events-none" />
          <div className="relative rounded-3xl border border-slate-800 overflow-hidden bg-slate-900 shadow-2xl p-2 h-full">
            <img
              src={image2}
              alt="Agricultural monitoring"
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
        </motion.div>

      </section>

    </div>
  );
};

export default Hero;
