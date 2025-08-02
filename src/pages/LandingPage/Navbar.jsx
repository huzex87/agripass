import React, { useState } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../../constants/motion";
import { X } from "lucide-react";
import { Menu, User } from "lucide-react";
import navlogo from "../../assets/navlogo.jpg";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "../../context/NewThemeContext";
import { Sun, Moon } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("#home");
  const { theme, toggleTheme } = useTheme();

  const MotionLink = motion(Link);

  const navLinks = [
    { path: "#home", label: "Home" },
    { path: "#about", label: "About Us" },
    { path: "#services", label: "Our Service" },
    { path: "#testimonials", label: "Testimonials" },
  ];

  return (
    <motion.nav
      variants={fadeIn("down", 0.2)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="fixed top-0 left-0 right-0 bg-slate-100/90 dark:bg-gray-900/90 backdrop-blur-sm z-50 border-b border-slate-100 shadow-sm"
    >
      <div className="w-full flex justify-between items-center container mx-auto px-4 sm:px-6 lg:px-8 md:h-20 h-16">
        <motion.div
          variants={fadeIn("right", 0.3)}
          className="flex items-center gap-1 cursor-pointer"
        >
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.1 }}>
            <img src={navlogo} alt="Brand Logo" className="scale-50" />
          </motion.div>
        </motion.div>

        {/* Mobile Button */}
        <motion.button
          variants={fadeIn("left", 0.3)}
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </motion.button>

        {/* Navigation Links - Desktop */}
        <motion.div
          variants={fadeIn("down", 0.3)}
          className="hidden md:flex items-center gap-10"
        >
          {navLinks.map(({ path, label }, index) => (
            <MotionLink
              key={index}
              variants={fadeIn("down", 0.1 * (index + 1))}
              to={path}
              onClick={() => setActiveLink(path)}
              className={`text-sm font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all ${
                activeLink === path
                  ? "text-blue-600 after:w-full"
                  : " hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {label}
            </MotionLink>
          ))}
        </motion.div>

        <motion.div variants={fadeIn("left", 0.3)}>
          <button className="btn-ghost size-10" onClick={toggleTheme}>
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </motion.div>

        {/* Account Dropdown */}
        <motion.div
          variants={fadeIn("left", 0.3)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:block"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2 bg-base-100 hover:bg-base-200 border border-gray-200">
                <User className="h-4 w-4" />
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-base-100" align="end">
              <DropdownMenuItem
                asChild
                className="hover:bg-base-200 focus:bg-base-300"
              >
                <Link
                  to="/create_deployment"
                  className="flex items-center w-full px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-300"
                >
                  Create Deployment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className="hover:bg-base-200 focus:bg-base-300"
              >
                <Link
                  to="/go_to_domain"
                  className="flex items-center w-full px-2 py-1.5 text-sm cursor-pointer hover:bg-gray-100"
                >
                  Go to Deployment
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>

      {/* MOBILE MENU VIEW */}
      {isMenuOpen && (
        <motion.div
          variants={fadeIn("down", 0.2)}
          initial="hidden"
          animate="show"
          className="md:hidden bg-slate-50 dark:bg-gray-900 border-t border-gray-100 py-4"
        >
          <motion.div
            variants={fadeIn("down", 0.3)}
            className="container mx-auto px-4 space-y-4"
          >
            {navLinks.map(({ path, label }, index) => (
              <MotionLink
                key={index}
                variants={fadeIn("down", 0.1 * (index + 1))}
                to={path}
                onClick={() => setActiveLink(path)}
                className={`block text-sm font-medium py-2 ${
                  activeLink === path
                    ? "text-blue-600 after:w-full"
                    : "text-gray-600 dark:text-slate-50 hover:text-gray-900"
                }`}
              >
                {label}
              </MotionLink>
            ))}

            {/* Mobile Account Options */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
              <motion.button
                variants={fadeIn("left", 0.3)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-100"
              >
                <Link to="/create_deployment">Create Deployment</Link>
              </motion.button>

              <motion.button
                variants={fadeIn("left", 0.3)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-200 text-sm font-medium transition-all"
              >
                <Link to="/go_to_domain">Go to Deployment</Link>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
