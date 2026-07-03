import React, { useState, useEffect } from "react";
import api from "../../utils/Api";
import { toast } from "sonner";
import { Loader2, Calendar, CreditCard, CheckCircle2 } from "lucide-react";
import { formatDate } from "../../utils/dateFormatter";

const RepaymentList = ({ onRepaymentSuccess }) => {
  const [repayments, setRepayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const fetchRepayments = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/farmer/repayments");
      if (res.data?.status === "success") {
        setRepayments(res.data.data);
      }
    } catch (err) {
      console.error("Error loading repayments:", err);
      toast.error("Failed to load repayment schedule");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepayments();
  }, []);

  const handleRepay = async (disbursementId, installmentId) => {
    setPayingId(installmentId);
    try {
      const res = await api.post("/api/v1/farmer/repay", {
        disbursementId,
        installmentId,
      });

      if (res.data?.status === "success") {
        toast.success("Repayment processed successfully!");
        fetchRepayments(); // reload lists
        if (onRepaymentSuccess) {
          onRepaymentSuccess(res.data.data.newBalance);
        }
      }
    } catch (err) {
      const message = err.response?.data?.error || "Repayment processing failed";
      toast.error(message);
    } finally {
      setPayingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  // Extract all installments in a single flat list
  const installments = [];
  repayments.forEach((d) => {
    d.repaymentSchedule.forEach((inst) => {
      installments.push({
        disbursementId: d._id,
        projectId: d.projectId,
        installment: inst,
      });
    });
  });

  if (installments.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400">No input financing repayments scheduled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
        <div className="p-5 border-b border-slate-50 dark:border-slate-800/60">
          <h3 className="font-bold text-lg text-slate-950 dark:text-white">Repayment Schedule</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Shariah-Compliant Murabaha/Salam Input Financing Ledgers</p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
          {installments.map(({ disbursementId, projectId, installment }) => {
            const isOverdue =
              installment.status === "overdue" ||
              (installment.status === "pending" && new Date() > new Date(installment.dueDate));

            return (
              <div
                key={installment._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                    {projectId?.name || "Project Intervention"}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      ₦{installment.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {installment.repaymentType}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar size={13} />
                    <span>Due: {formatDate(installment.dueDate)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  {/* Status Badge */}
                  {installment.status === "paid" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400 border border-green-200 dark:border-green-800/30">
                      <CheckCircle2 size={13} /> Paid
                    </span>
                  ) : isOverdue ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400 border border-red-200 dark:border-red-800/30">
                      Overdue
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
                      Pending
                    </span>
                  )}

                  {/* Payment Button */}
                  {installment.status !== "paid" && (
                    <button
                      className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                      onClick={() => handleRepay(disbursementId, installment._id)}
                      disabled={payingId !== null}
                    >
                      {payingId === installment._id ? (
                        <Loader2 className="animate-spin h-3 w-3" />
                      ) : (
                        <CreditCard size={13} />
                      )}
                      Pay Installment
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RepaymentList;
