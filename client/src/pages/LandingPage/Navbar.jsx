import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../constants/motion";
import { X, Menu, User, Sun, Moon, Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "../../context/NewThemeContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");
  const { theme, toggleTheme } = useTheme();

  const MotionLink = motion(Link);

  const navLinks = [
    { path: "#home", label: "Home" },
    { path: "#features", label: "Features" },
    { path: "/projects", label: "Interventions" },
  ];

  return (
    <motion.nav
      variants={fadeIn("down", 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="fixed top-0 left-0 right-0 bg-slate-950/80 dark:bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-900 shadow-lg"
    >
      <div className="w-full flex justify-between items-center container mx-auto px-6 md:h-20 h-16">
        
        {/* Brand Logo */}
        <motion.div
          variants={fadeIn("right", 0.3)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400 border border-emerald-500/30">
              <Leaf size={20} />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-wider uppercase">AgriPass</span>
              <span className="block text-[8px] uppercase tracking-widest text-emerald-400">Agricultural Ledger</span>
            </div>
          </Link>
        </motion.div>

        {/* Navigation Links - Desktop */}
        <motion.div
          variants={fadeIn("down", 0.3)}
          className="hidden md:flex items-center gap-8"
        >
          {navLinks.map(({ path, label }, index) => (
            <MotionLink
              key={index}
              variants={fadeIn("down", 0.1 * (index + 1))}
              to={path}
              onClick={() => setActiveLink(path)}
              className={`text-xs font-semibold uppercase tracking-wider relative py-1 text-slate-300 hover:text-white transition-colors ${
                activeLink === path ? "text-emerald-400" : ""
              }`}
            >
              {label}
              {activeLink === path && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"
                />
              )}
            </MotionLink>
          ))}
        </motion.div>

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold px-4 py-2">
                <User className="h-4.5 w-4.5 text-emerald-400" />
                Access Portal
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 bg-slate-900 border-slate-800 text-slate-300" align="end">
              <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white">
                <Link to="/signin" className="flex items-center w-full px-2 py-2 text-xs font-bold">
                  Cooperative Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white">
                <Link to="/login/beneficiary" className="flex items-center w-full px-2 py-2 text-xs font-bold">
                  Farmer Portal Login
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-slate-800 focus:text-white border-t border-slate-800">
                <Link to="/create_deployment" className="flex items-center w-full px-2 py-2 text-xs font-bold text-emerald-400">
                  Register Cooperative
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Button Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button 
            onClick={toggleTheme} 
            className="p-2 text-slate-400 hover:text-white"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button
            className="text-slate-300 hover:text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU VIEW */}
      {isMenuOpen && (
        <motion.div
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          animate="show"
          className="md:hidden bg-slate-950 border-t border-slate-900 py-6"
        >
          <div className="container mx-auto px-6 space-y-5">
            {navLinks.map(({ path, label }, index) => (
              <MotionLink
                key={index}
                variants={fadeIn("down", 0.1 * (index + 1))}
                to={path}
                onClick={() => {
                  setActiveLink(path);
                  setIsMenuOpen(false);
                }}
                className={`block text-sm font-bold uppercase tracking-wider ${
                  activeLink === path ? "text-emerald-400" : "text-slate-400 hover:text-white"
                }`}
              >
                {label}
              </MotionLink>
            ))}

            <div className="space-y-3 pt-4 border-t border-slate-900">
              <Link 
                to="/login/beneficiary"
                className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Farmer Login
              </Link>
              <Link 
                to="/signin"
                className="block w-full text-center bg-slate-900 border border-slate-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Cooperative Login
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
