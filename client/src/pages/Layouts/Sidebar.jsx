import { forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { Leaf } from "lucide-react";
import { navbarLinks } from "../../constants/index";
import cn from "../../utils/cn";
import PropTypes from "prop-types";

export const Sidebar = forwardRef(({ collapsed }, ref) => {
  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-200 bg-white transition-[width,left] duration-300 dark:border-slate-800 dark:bg-slate-900",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex h-[60px] flex-shrink-0 items-center gap-2 border-b border-slate-200 px-4 dark:border-slate-800",
          collapsed && "md:justify-center md:px-0"
        )}
      >
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/30">
          <Leaf size={18} />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-sm font-extrabold uppercase tracking-wide text-slate-900 dark:text-white">
              AgriPass
            </p>
            <p className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Cooperative
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex w-full flex-col gap-y-5 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:_thin]">
        {navbarLinks.map((group) => (
          <nav
            key={group.title}
            className={cn("flex w-full flex-col gap-y-1", collapsed && "md:items-center")}
          >
            {!collapsed && (
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {group.title}
              </p>
            )}
            {group.links.map((link) => (
              <NavLink
                key={link.label}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "group flex h-[42px] flex-shrink-0 items-center gap-x-3 rounded-xl px-3 text-sm font-medium transition-colors",
                    collapsed && "md:w-[46px] md:justify-center md:px-0",
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                  )
                }
                title={collapsed ? link.label : undefined}
              >
                <link.icon size={20} className="flex-shrink-0" />
                {!collapsed && <span className="whitespace-nowrap">{link.label}</span>}
              </NavLink>
            ))}
          </nav>
        ))}
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

Sidebar.propTypes = {
  collapsed: PropTypes.bool,
};
