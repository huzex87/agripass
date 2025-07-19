import { useState, useEffect, use } from "react";
import { useTheme } from "../../context/NewThemeContext";
import { Bell, ChevronsLeft, Moon, Search, Sun, LogOut } from "lucide-react";
import PropTypes from "prop-types";
import { useAuthentication } from "../../Utilis/Auth";
import Dialogue from "../Elements/Dialogue";

export const Header = ({ collapsed, setCollapsed }) => {
  const { theme, toggleTheme } = useTheme();
  const [open, setIsopen] = useState(false);

  const { logout } = useAuthentication();

  const handleOpenModal = () => {
    setIsopen(() => document.getElementById("my_modal_1").showModal());
  };
  const handleLogout = () => {
    logout();
  };
  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronsLeft className={`${collapsed ? "rotate-180" : ""}`} />
        </button>
        <div className="input">
          <Search size={20} className="text-slate-300" />
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search..."
            className="w-full bg-transparent text-slate-900 outline-0 placeholder:text-slate-300 dark:text-slate-50"
          />
        </div>
      </div>
      {/* Toggle theme button */}
      <div className="flex items-center gap-x-3">
        <button className="btn-ghost size-10" onClick={toggleTheme}>
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost rounded-field"
          >
            <div className="size-10 overflow-hidden rounded-full">
              <img
                // src={profileImg}
                alt="profile image"
                className="size-full object-cover"
              />
            </div>
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
      <Dialogue Logout={handleLogout} OpenModal={handleOpenModal} />
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
