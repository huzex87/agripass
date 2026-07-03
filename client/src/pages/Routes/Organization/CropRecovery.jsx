import React, { useState } from "react";
import api from "../../../utils/Api";
import { toast } from "sonner";
import { Loader2, CheckCircle2, ShieldAlert, Scale, User, BookOpen, Weight } from "lucide-react";

const CropRecovery = () => {
  const [farmerId, setFarmerId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [cropType, setCropType] = useState("wheat");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryData, setRecoveryData] = useState(null);
  const [error, setError] = useState("");

  const valuationRates = {
    wheat: 450,
    rice: 400,
    maize: 350
  };

  const currentRate = valuationRates[cropType] || 300;
  const estimatedCredit = weight ? parseFloat(weight) * currentRate : 0;

  const handleRegisterDelivery = async (e) => {
    e.preventDefault();
    if (!farmerId || !projectId || !weight) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    setRecoveryData(null);

    try {
      const res = await api.post("/api/v1/warehouse/crop-recovery", {
        beneficiaryId: farmerId,
        projectId,
        cropType,
        weight: parseFloat(weight)
      });

      if (res.data?.status === "success") {
        setRecoveryData(res.data.data);
        toast.success("Crop recovery delivery logged successfully!");
      }
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to submit crop delivery.";
      setError(msg);
      toast.error("Delivery Error", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFarmerId("");
    setProjectId("");
    setWeight("");
    setRecoveryData(null);
    setError("");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-700 to-teal-800 p-6 text-white text-center">
          <h3 className="text-xl font-extrabold tracking-tight">Salam Crop recovery Ledger</h3>
          <p className="text-xs text-emerald-100 mt-1.5">Accept in-kind crop harvests as repayment credit</p>
        </div>

        <div className="p-8">
          {!recoveryData ? (
            <form onSubmit={handleRegisterDelivery} className="space-y-6">
              
              {/* Farmer ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <User size={15} /> Farmer / Beneficiary ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Mongoose Beneficiary ObjectId"
                  value={farmerId}
                  onChange={(e) => setFarmerId(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-sm text-slate-800 dark:text-white"
                />
              </div>

              {/* Project ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <BookOpen size={15} /> Project Intervention ID
                </label>
                <input
                  type="text"
                  placeholder="Enter Mongoose Project ObjectId"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-sm text-slate-800 dark:text-white"
                />
              </div>

              {/* Crop Type & Weight Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Crop Type
                  </label>
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-sm text-slate-800 dark:text-white"
                  >
                    <option value="wheat">Wheat (₦450/kg)</option>
                    <option value="rice">Rice (₦400/kg)</option>
                    <option value="maize">Maize (₦350/kg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <Weight size={15} /> Crop Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="e.g. 120.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all text-sm text-slate-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Live Credit Estimate Card */}
              {weight && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 flex justify-between items-center">
                  <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Estimated Repayment Credit:</span>
                  <span className="text-lg font-bold text-emerald-900 dark:text-white">₦{estimatedCredit.toLocaleString()}</span>
                </div>
              )}

              {error && (
                <div className="flex gap-2 p-4 rounded-2xl bg-red-50 text-red-700 text-sm border border-red-100 dark:bg-red-950/20 dark:border-red-900/30">
                  <ShieldAlert className="shrink-0" size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !farmerId || !projectId || !weight}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <span>Record Crop Receipt</span>
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
                <h4 className="font-extrabold text-lg text-slate-900 dark:text-white">Salam Crop Delivery Recorded</h4>
                <p className="text-xs text-slate-500 mt-1">In-kind crop delivery credited to farmer schedule</p>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/50 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-4">
                
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Total Credit Generated</span>
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    ₦{recoveryData.totalCreditGenerated.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Salam Valuation Rate</span>
                  <span className="font-bold text-sm text-slate-800 dark:text-white">
                    ₦{recoveryData.ratePerKg}/kg
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Installments Cleared</span>
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {recoveryData.clearedInstallmentsCount} installment(s)
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <span className="text-xs text-slate-400 font-semibold uppercase">Remaining Surplus Credit</span>
                  <span className="font-bold text-sm text-emerald-600">
                    ₦{recoveryData.remainingCredit.toLocaleString()}
                  </span>
                </div>

              </div>

              <button
                onClick={resetForm}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-2xl transition-all"
              >
                Record Another Crop Delivery
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CropRecovery;
