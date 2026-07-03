import React from "react";
import { motion } from "framer-motion";
import { fadeIn, textVariant } from "../../constants/motion";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Leaf } from "lucide-react";

const Footer = () => {
  const motionLink = motion(Link);

  const footerLinks = {
    platform: [
      { name: "Farmer Access", to: "/login/beneficiary" },
      { name: "Cooperative Log", to: "/signin" },
      { name: "Terms of Service", to: "#" },
      { name: "Privacy Policy", to: "#" },
    ],
    features: [
      { name: "Interactive Mapping", to: "#features" },
      { name: "Voucher Desk", to: "#features" },
      { name: "KYC Biometrics", to: "#features" },
    ],
    support: [
      { name: "Help Desk", to: "#" },
      { name: "System Status", to: "#" },
      { name: "Documentation", to: "#" },
    ],
  };

  return (
    <motion.footer
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="bg-slate-950 border-t border-slate-900"
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info Column */}
          <motion.div variants={fadeIn("right", 0.4)} className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Leaf size={16} />
              </div>
              <span className="font-extrabold text-lg uppercase tracking-wider">AgriPass</span>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Connecting agricultural cooperatives, smallholder farms, and verification warehouses in one single ledger.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3.5 pt-2">
              <a href="#" className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Twitter size={16} />
              </a>
              <a href="#" className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </motion.div>

          {/* Links Column */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {Object.entries(footerLinks).map(([category, links], idx) => (
              <div key={category} className="space-y-4">
                <h4 className="text-xs font-extrabold text-white uppercase tracking-widest">
                  {category}
                </h4>
                <ul className="space-y-2">
                  {links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link to={link.to} className="text-slate-400 hover:text-white text-xs transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-slate-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px] uppercase tracking-wider font-semibold">
          <p>© {new Date().getFullYear()} agripass.com.ng. All rights reserved.</p>
          <p>Powered by Kirkira Innovation Hub</p>
        </div>

      </div>
    </motion.footer>
  );
};

export default Footer;
