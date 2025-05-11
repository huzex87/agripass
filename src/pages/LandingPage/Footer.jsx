import React from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../constants/motion";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const motionLink = motion(Link);

  const footerLinks = {
    company: [
      { name: "About", to: "#" },
      { name: "Terms of Use", to: "#" },
      { name: "Privacy Policy", to: "#" },
      { name: "How it Works", to: "#" },
      { name: "Contact Us", to: "#" },
    ],
    getHelp: [
      { name: "Support Carrer", to: "#" },
      { name: "24h Service", to: "#" },
      { name: "Quick Chat", to: "#" },
    ],
    support: [
      { name: "FAQ", to: "#" },
      { name: "Policy", to: "#" },
      { name: "Business", to: "#" },
    ],
    contact: [
      { name: "WhatsApp", to: "#" },
      { name: "Support 24", to: "#" },
    ],
  };
  return (
    <motion.footer
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      className="bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          variants={fadeIn("up", 0.3)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Brand Column */}
          <motion.div variants={fadeIn("right", 0.4)} className="lg:col-span-4">
            <motion.div
              variants={fadeIn("down", 0.5)}
              className="flex items-center gap-1 mb-6"
            >
              <img src="" alt="Company Logo" />
              <motion.h1
                variants={textVariant(0.2)}
                className="text-2xl font-bold text-gray-800"
              >
                Disbursify
              </motion.h1>
            </motion.div>
            <motion.p variants={fadeIn("up", 0.6)}>
              An innovative, comprehensive platform designed to streamline data
              collection, verification, and disbursement of resources for
              government and non-governmental organisations (NGOs).
            </motion.p>
            <motion.div
              variants={fadeIn("up", 0.7)}
              className="flex gap-4 mt-4"
            >
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-pink-600 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Links Column */}
          <motion.div variants={fadeIn("left", 0.4)} className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(
                ([category, categoryLinks], index) => (
                  <motion.div
                    key={category}
                    variants={fadeIn("up", 0.3 * (index + 1))}
                  >
                    <motion.h3 variants={textVariant(0.2)}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </motion.h3>
                    <motion.ul className="mt-4 space-y-2">
                      {categoryLinks.map((item, index) => (
                        <motion.li
                          key={index}
                          variants={fadeIn("up", 0.1 * (index + 1))}
                        >
                          <motionLink to={item.to}> {item.name} </motionLink>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={fadeIn("up", 0.8)}
          className="border-t border-gray-200 mt-12 pt-8"
        >
          <motion.div
            variants={fadeIn("up", 0.9)}
            className="flex flex-col md:flex-row justify-between items-center gap-4"
          >
            <motion.p
              variants={fadeIn("right", 1.0)}
              className="text-gray-600 text-sm"
            >
              Copyright © {new Date().getFullYear()} disbursify.com.ng
            </motion.p>
            <motion.p
              variants={fadeIn("left", 1.0)}
              className="text-gray-600 text-sm"
            >
              <span className="font-semibold">Powered By</span> Kirkira
              Innovation Hub
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
