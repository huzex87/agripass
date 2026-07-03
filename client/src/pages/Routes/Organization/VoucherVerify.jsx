import React, { useState } from "react";
import axios from "axios";
import api from "../../../utils/Api";
import { toast } from "sonner";
import { Loader2, CheckCircle2, ShieldAlert, Package, User, Calendar } from "lucide-react";

const VoucherVerify = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [voucherData, setVoucherData] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!code) {
      toast.error("Please enter a voucher code");
      return;
    }

    setLoading(true);
    setError("");
    setVoucherData(null);

    try {
      const res = await api.post("/api/v1/voucher/redeem", { code });
      if (res.data?.status === "success") {
        setVoucherData(res.data.data);
        toast.success("Voucher verified and redeemed successfully!");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Voucher verification failed.";
      setError(msg);
      toast.error("Verification Error", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCode("");
    setVoucherData(null);
    setError("");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-700 to-blue-800 p-6 text-white text-center">
          <h3 className="text-xl font-extrabold tracking-tight">Warehouse Input Verification</h3>
          <p className="text-xs text-indigo-100 mt-1.5">Redeem and verify farmer input vouchers (seeds, fertilizers)</p>
        </div>

        <div className="p-8">
          {!voucherData ? (
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Voucher Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. VP-ABCD-EFGH"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-center font-mono text-lg tracking-widest text-slate-800 dark:text-white"
                />
              </div>

              {error && (
                <div className="flex gap-2 p-4 rounded-2xl bg-red-50 text-red-700 text-sm border border-red-100 dark:bg-red-950/20 dark:border-red-900/30">
                  <ShieldAlert className="shrink-0" size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !code}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <span>Verify & Dispense Inputs</span>
                )}
              </button>
            </form>
          ) : (
            /* Successful Verification Receipt Card */
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-full border border-green-200 dark:border-green-800/30 mb-3">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Redemption Confirmed</h4>
                <p className="text-xs text-slate-500 mt-1">Dispense items listed below to the farmer</p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-4">
                
                {/* Farmer Details */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-xl">
                    <User size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Beneficiary / Farmer</span>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {voucherData.beneficiaryId?.personalDetails
                        ? `${voucherData.beneficiaryId.personalDetails.firstName} ${voucherData.beneficiaryId.personalDetails.lastName}`
                        : "Unknown Farmer"}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="flex items-center gap-3 pt-4">
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-600 rounded-xl">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Project Intervention</span>
                    <span className="font-semibold text-sm text-slate-900 dark:text-white">
                      {voucherData.projectId?.name || "AgriPass Intervention"}
                    </span>
                  </div>
                </div>

                {/* Disbursed Item details */}
                <div className="flex items-center gap-3 pt-4">
                  <div className="p-2 bg-green-50 dark:bg-green-950/30 text-green-600 rounded-xl">
                    <Package size={18} />
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Disbursed Item details</span>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {voucherData.itemDetails?.itemName} (Qty: {voucherData.itemDetails?.quantity || 1})
                    </span>
                  </div>
                </div>

              </div>

              <button
                onClick={resetForm}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-2xl transition-all"
              >
                Scan/Verify Another Voucher
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default VoucherVerify;
