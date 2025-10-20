"use client";

import { useState } from "react";
import { Menu, X, ChevronDown, LogOut } from "lucide-react";
import { useAuthentication } from "../../../../Utilis/Auth";
import Dialogue from "../../../Elements/Dialogue";

export default function ResponsiveHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [open, setIsopen] = useState(false);

  const { logout } = useAuthentication();

  const handleOpenModal = () => {
    setIsopen(() => document.getElementById("my_modal_1").showModal());
  };
  const handleLogout = () => {
    logout();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-blue-950/85 dark:bg-gray-900/90 backdrop-blur-sm  shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
                Logo
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 items-center">
              <a
                href="#"
                className="text-white hover:text-blue-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Home
              </a>
              <a
                href="#"
                className="text-white hover:text-blue-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Application Status
              </a>

              {/* Dropdown Menu */}
              <div className="dropdown dropdown-hover">
                <div
                  tabIndex={0}
                  role="button"
                  className=" cursor-pointer text-white hover:text-blue-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Hover
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                  <li>
                    <a>Item 1</a>
                  </li>
                  <li>
                    <a>Item 2</a>
                  </li>
                </ul>
              </div>

              <a
                href="#"
                className="text-white hover:text-blue-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Contact
              </a>
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost rounded-field text-white hover:text-blue-950"
                >
                  Account
                </div>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm"
                >
                  <li>
                    <a>Item 2</a>
                  </li>

                  <li>
                    <div className="flex items-center gap-2">
                      <LogOut
                        size={15}
                        className=" flex-shrink-0 text-red-600 cursor-pointer"
                        onClick={handleOpenModal}
                      />
                      <button
                        className="text-red-500 cursor-pointer"
                        onClick={handleOpenModal}
                      >
                        Log Out
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white hover:text-blue-600 focus:outline-none p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
                <a
                  href="#"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                >
                  Application Status
                </a>

                {/* Mobile Services Submenu */}
                <div className="px-3 py-2">
                  <span className="block text-base font-medium text-gray-700 mb-2">
                    Services
                  </span>
                  <div className="pl-4 space-y-1">
                    <a
                      href="#"
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    >
                      Web Development
                    </a>
                    <a
                      href="#"
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    >
                      Mobile Apps
                    </a>
                    <a
                      href="#"
                      className="block px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                    >
                      Consulting
                    </a>
                  </div>
                </div>

                <a
                  href="#"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                >
                  Contact
                </a>

                {/* Mobile CTA Button */}
                {/* <div className="px-3 pt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-base font-medium transition-colors duration-200">
                    Get Started
                  </button>
                </div> */}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
