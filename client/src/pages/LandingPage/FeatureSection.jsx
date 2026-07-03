import React from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../constants/motion";
import { Link } from "react-router-dom";
import {
  HandCoins,
  Wallet,
  KeyRound,
  ShieldCheck,
  Database,
  Gauge,
  Download,
  MapPin,
  Fingerprint
} from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: <Database size={22} />,
      title: "Data Collection",
      description:
        "Customizable forms for demographic data entry, including vulnerability tags, cooperative association ID, and polling unit selections.",
    },
    {
      icon: <Fingerprint size={22} />,
      title: "Biometrics Capture",
      description:
        "Integration of face photo frames and fingerprint KYC hash captures to eliminate duplicate identity profiles in the cooperative registrar.",
    },
    {
      icon: <KeyRound size={22} />,
      title: "Unique Vouchers",
      description:
        "Automatic generation of verified input voucher codes sent to farmers for input retrieval at warehouse dispatch desks.",
    },
    {
      icon: <HandCoins size={22} />,
      title: "Resource Disbursement",
      description:
        "Seamless tracking and allocation of fertilizers, wheat seeds, tools, or cash grants upon successful warehouse verifications.",
    },
    {
      icon: <Wallet size={22} />,
      title: "Shariah Ledgers",
      description:
        "Non-interest Murabaha schedules and post-harvest Salam in-kind crop recovery ledgers linked to secure farmer wallets.",
    },
    {
      icon: <Gauge size={22} />,
      title: "Real-time Dashboard",
      description:
        "A centralized metrics dashboard for organization stakeholders to track collection rates, active loans, and print audit reports.",
    },
    {
      icon: <Download size={22} />,
      title: "Offline registration",
      description:
        "IndexedDB offline queue syncing. Save registrations locally without internet; queue submits automatically when network connection returns.",
    },
    {
      icon: <MapPin size={22} />,
      title: "Geospatial Boundary Map",
      description:
        "GPS coordinate plot pickers mapping farm boundaries, calculating land sizes (hectares), and saving GeoJSON coordinates offline.",
    },
  ];

  return (
    <section id="features" className="bg-slate-900 border-t border-slate-900 py-20 px-6">
      <motion.div
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto space-y-12"
      >
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-white tracking-tight md:text-4xl">
            Key Features of AgriPass
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Everything field agents, cooperative administrators, and warehouse workers need to manage farm input disbursements.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", 0.1 * (index + 1))}
              className="group relative bg-slate-950 border border-slate-800 p-6 rounded-2xl transition-all duration-300 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-950/20"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                {feature.icon}
              </div>

              {/* Title */}
              <h4 className="text-base font-bold text-white mb-2">{feature.title}</h4>

              {/* Description */}
              <p className="text-slate-400 text-xs leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Get started link */}
        <div className="text-center pt-6">
          <Link
            to="/login/beneficiary"
            className="inline-flex items-center gap-1.5 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
          >
            Access Farmer Portal
          </Link>
        </div>

      </motion.div>
    </section>
  );
};

export default FeatureSection;
