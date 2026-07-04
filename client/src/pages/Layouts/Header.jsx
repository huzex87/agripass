import { useState, useRef } from "react";
import { useTheme } from "../../context/NewThemeContext";
import { Menu, Moon, Sun, LogOut, ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
import { useAuthentication } from "../../utils/Auth";
import { useClickOutside } from "../../hooks/useClickOutside";
import Dialogue from "../Elements/Dialogue";

const getInitials = (name = "") => {
  const parts = name.trim().split(/[\s-]+/).filter(Boolean);
  if (parts.length === 0) return "AP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const Header = ({ collapsed, setCollapsed }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout, user, subdomain } = useAuthentication();
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside([menuRef], () => setMenuOpen(false));

  const displayName = user?.organizationName || subdomain || "Cooperative";
  const initials = getInitials(displayName);

  return (
    <header className="sticky top-0 z-10 flex h-[60px] items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-900/90">
      <div className="flex items-center gap-x-3">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {displayName}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            {subdomain ? `${subdomain}.agripass` : "Cooperative Portal"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Profile menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg p-1 pr-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
              {initials}
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {displayName}
                </p>
                <p className="truncate text-xs text-slate-400">Cooperative Admin</p>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setIsOpen(true);
                }}
                className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      <Dialogue isOpen={isOpen} onClose={() => setIsOpen(false)} onConfirm={logout} />
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
