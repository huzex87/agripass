import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../constants/motion";
import verification from "../../assets/verification.png";
import { CheckCircle2, ShieldAlert, Cpu } from "lucide-react";

const Section2 = () => {
  return (
    <section className="w-full py-20 px-6 bg-slate-950 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={fadeIn("up", 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Image */}
          <div className="relative order-2 lg:order-1">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent blur-lg scale-95 pointer-events-none" />
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900 p-4">
              <img
                src={verification}
                alt="Verification interface"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Right Column - Text Details */}
          <div className="space-y-6 order-1 lg:order-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl leading-tight">
              Biometrics, Geotagging, and Ledger Integration
            </h2>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              By combining robust data capture, simulated biometrics, GPS boundary plots, unique input tokens, and real-time ledger audits, AgriPass ensures resources land directly in verified hands.
            </p>

            <ul className="space-y-3.5 pt-2">
              <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Geospatial picker for mapping farm boundaries and land size (hectares).</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Biometric photo frame and fingerprint hash verification.</span>
              </li>
              <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Offline queuing with IndexedDB to register farmers without cell network.</span>
              </li>
            </ul>
          </div>

        </motion.div>
      </div>
    </section>
  );
};

export default Section2;
