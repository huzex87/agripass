import React, { useState, useEffect } from "react";
import api from "../../../utils/Api";
import Header from "./Components/Header";
import Hero from "./Components/Hero";
import Projects from "./Components/Projects";
import RepaymentList from "../../../components/ui/RepaymentList";
import FarmerIDCard from "../../../components/ui/FarmerIDCard";
import { Wallet, Loader2, Award, User } from "lucide-react";

const Beneficiary = () => {
  const [balance, setBalance] = useState(0);
  const [walletLoading, setWalletLoading] = useState(true);
  const [farmerInfo, setFarmerInfo] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchWallet = async () => {
    try {
      const res = await api.get("/api/v1/farmer/wallet");
      if (res.data?.status === "success") {
        setBalance(res.data.data.balance);
      }
    } catch (err) {
      console.error("Error fetching farmer wallet:", err);
    } finally {
      setWalletLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/v1/farmer/profile");
      if (res.data?.status === "success") {
        setFarmerInfo(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching farmer profile:", err);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchProfile();
  }, []);

  const handleRepaymentSuccess = (newBalance) => {
    setBalance(newBalance);
  };

  return (
    <>
      <Header />
      <Hero />

      {/* Farmers Dashboard Stats & Wallet Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Wallet & ID Card */}
          <div className="lg:col-span-1 space-y-8">

            {/* Wallet Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-indigo-900 text-white rounded-3xl p-6 shadow-xl shadow-indigo-500/10">
              {/* Decorative Circle Shapes */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mt-8" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">AgriPass Wallet</p>
                  <p className="text-xs text-blue-200 mt-1">Active Account</p>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Wallet size={20} className="text-white" />
                </div>
              </div>

              {walletLoading ? (
                <div className="h-10 flex items-center">
                  <Loader2 className="animate-spin h-5 w-5 text-white" />
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-sm font-medium text-blue-200">Balance</span>
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    ₦{balance.toLocaleString()}
                  </h2>
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-blue-100">
                <span>Currency: NGN</span>
                <span className="flex items-center gap-1">
                  <Award size={13} className="text-amber-400" />
                  Premium Member
                </span>
              </div>
            </div>

            {/* Farmer ID Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <User size={16} className="text-blue-500" />
                AgriPass Digital Identity
              </h4>
              {profileLoading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
                </div>
              ) : (
                <FarmerIDCard farmerInfo={farmerInfo} />
              )}
            </div>

          </div>

          {/* Repayment Schedule Ledger Column */}
          <div className="lg:col-span-2">
            <RepaymentList onRepaymentSuccess={handleRepaymentSuccess} />
          </div>

        </div>
      </div>

      <Projects />
    </>
  );
};

export default Beneficiary;
