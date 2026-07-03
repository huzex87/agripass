import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../constants/motion";
import illustration from "../../assets/illustration.png";
import { CheckCircle2, Award, Zap } from "lucide-react";

const Section1 = () => {
  return (
    <section className="w-full bg-slate-900 border-t border-slate-900 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Text block */}
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-tight">
              Bridging Transparency and Field Operations Gaps
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              AgriPass resolves critical efficiency, accountability, and tracking bottlenecks during large-scale resource disbursement programs. We specialize in target verification for farm inputs, crop loans, and subsidized items.
            </p>

            <ul className="space-y-3.5 pt-2">
              <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Custom demographic parameters (gender, vulnerability, household size).</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Detailed electoral geography scoping (state, LGA, ward, polling unit).</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Multi-tenant isolation for distinct farmer cooperative operations.</span>
              </li>
            </ul>
          </div>

          {/* Graphic block */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/10 to-transparent blur-lg scale-95 pointer-events-none" />
            <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-4">
              <img
                src={illustration}
                alt="Accountability metrics"
                className="w-full h-auto rounded-lg opacity-85"
              />
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Section1;
