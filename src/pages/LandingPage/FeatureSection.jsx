import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../constants/motion";
import { textVariant } from "../../constants/motion";
import {
  HandCoins,
  Wallet,
  KeyRound,
  ShieldCheck,
  Database,
  Gauge,
  Download,
  MapPin,
} from "lucide-react";

const FeatureSection = () => {
  const features = [
    {
      icon: <Database />,
      title: "Data Collection",
      description:
        "Customizable forms for demographic data entry, including gender, ID type, ID number, cooperative association membership, association ID, state, LGA, ward, and polling unit.",
    },
    {
      icon: <ShieldCheck />,
      title: "Verification Mechanism",
      description:
        " Integration of biometric capture tools and ID verification systems to ensure authenticity.",
    },
    {
      icon: <KeyRound />,
      title: "Unique Token Generation",
      description:
        "Automatic creation of personalised tokens sent via SMS and email for individual verification at designated collection centres.",
    },
    {
      icon: <HandCoins />,
      title: "Resource Disbursement",
      description:
        "Seamless allocation of funds, farming inputs, or other resources upon successful verification.",
    },
    {
      icon: <Wallet />,
      title: "Wallet and Payment Gateway",
      description:
        "A secure digital wallet for handling monetary transactions between beneficiaries and collection centres.",
    },
    {
      icon: <Gauge />,
      title: "Real-time Dashboard",
      description:
        " A centralized dashboard for stakeholders to monitor progress, track distribution, and generate reports.",
    },
    {
      icon: <Download />,
      title: "Bulk Data Import",
      description:
        "  Support for uploading large datasets from Excel spreadsheets or other suitable formats for efficient batch processing.",
    },
    {
      icon: <ShieldCheck />,
      title: "Instant Token Generation",
      description:
        " Automated, on-the-fly token creation and broadcasting for real-time beneficiary verification.",
    },
    {
      icon: <MapPin />,
      title: "Geotagging for Monitoring",
      description:
        " Geo-coordinates capture for farm lands, business locations, and other relevant sites to facilitate effective post-disbursement tracking and monitoring of beneficiaries.",
    },
  ];
  return (
    <section className=" dark:bg-gray-800">
      <motion.div
        variants={fadeIn("up", 0.2)}
        initial="hidden"
        whileInView="show"
        className="max-w-7xl mx-auto px-4 py-16"
      >
        <motion.div
          variants={textVariant(0.2)}
          className="text-3xl font-bold mb-4"
        >
          <motion.h1
            variants={textVariant(0.2)}
            className="text-3xl font-bold mb-4 text-center"
          >
            Key Features of Disbursify
          </motion.h1>
        </motion.div>
        {/* Features lists */}
        <motion.div
          variants={fadeIn("up", 0.5)}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeIn("up", 0.3 * (index + 1))}
              className="flex flex-col items-center p-6"
            >
              {/* Icon */}
              <motion.div
                variants={fadeIn("down", 0.4 * (index + 1))}
                className="w-24 h-24 rounded-full mb-6 flex items-center justify-center bg-fuchsia-100 dark:bg-base-300 animate-pulse"
              >
                <motion.div
                  variants={fadeIn("up", 0.5 * (index + 1))}
                  className="text-3xl"
                >
                  {feature.icon}
                </motion.div>
              </motion.div>
              {/* Title */}
              <motion.h3
                variants={textVariant(0.3)}
                className="text-2xl font-medium mb-3"
              >
                {" "}
                {feature.title}{" "}
              </motion.h3>
              {/* description */}
              <motion.p
                variants={fadeIn("up", 0.6 * (index + 1))}
                className="text-gray-500 dark:text-white text-center"
              >
                {" "}
                {feature.description}{" "}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={fadeIn("up", 0.7)} className="text-center mt-12">
          <motion.button
            variants={fadeIn("up", 0.8)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white cursor-pointer px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors relative"
          >
            Get Started
            <div className="absolute -z-10 w-full h-full rounded-full bg-blue-600/30 blur-xl top-0 left-0"></div>
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeatureSection;
