import React, { useState } from "react";
import {
  FaUserCheck,
  FaWallet,
  FaMoneyCheckAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaSignOutAlt,
  FaCog,
  FaChartPie,
  FaFileDownload,
  FaUsers,
} from "react-icons/fa";
import "../styles/dashboard.css";
import Sidebar2 from "./components/Sidebar2";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Disbursify</h2>
          <FaTimes
            className="close-icon"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
        <nav>
          <ul className="sidebar-menu">
            <li className="menu-item active">
              <FaChartPie /> Dashboard
            </li>
            <li className="menu-item">
              <FaUsers /> Beneficiaries
            </li>
            <li className="menu-item">
              <FaUserCheck /> Verification
            </li>
            <li className="menu-item">
              <FaMoneyCheckAlt /> Disbursement
            </li>
            <li className="menu-item">
              <FaWallet /> Wallet
            </li>
            <li className="menu-item">
              <FaFileDownload /> Reports
            </li>
          </ul>
        </nav>

        {/* Settings & Logout */}
        <div className="sidebar-footer">
          <li className="menu-item">
            <FaCog className="settings-icon" /> Settings
          </li>
          <li className="menu-item logout">
            <FaSignOutAlt className="logout-icon" /> Logout
          </li>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Navbar */}
        <header className="dashboard-header">
          <FaBars className="menu-icon" onClick={() => setSidebarOpen(true)} />
          <h1 className="dashboard-heading">Dashboard</h1>
          <div className="header-icons">
            <FaBell className="icon" />
          </div>
        </header>

        {/* Statistics */}
        <div className="stats-grid">
          <div className="stats-card">
            <FaUsers className="stats-icon" />
            <h2>Total Beneficiaries</h2>
            <p>1,250</p>
          </div>
          <div className="stats-card">
            <FaMoneyCheckAlt className="stats-icon" />
            <h2>Funds Disbursed</h2>
            <p>$500,000</p>
          </div>
          <div className="stats-card">
            <FaWallet className="stats-icon" />
            <h2>Pending Verifications</h2>
            <p>120</p>
          </div>
        </div>

        {/* Analytics & Reports */}
        <div className="analytics-reports">
          <section className="analytics-section">
            <h2>Disbursement Analytics</h2>
            <div className="chart-placeholder">
              <FaChartPie className="chart-icon" />
              <p>Graph Data Coming Soon...</p>
            </div>
          </section>
          <section className="reports-section">
            <h2>Download Reports</h2>
            <button className="btn report-btn">
              <FaFileDownload /> Download
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
