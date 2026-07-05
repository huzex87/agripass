import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Leaf,
  LogOut,
  Users,
  Ticket,
  Loader2,
  Warehouse,
  ScanLine,
} from "lucide-react";
import api from "../../../utils/Api";
import { useAuthentication } from "../../../utils/Auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StatCard = ({ label, value, icon: Icon, accent }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
  </div>
);

const Center = () => {
  const { logout, user } = useAuthentication();
  const queryClient = useQueryClient();
  const [code, setCode] = useState("");
  const [redeeming, setRedeeming] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: ["centerDashboard"],
    queryFn: async () => (await api.get("/api/v1/center/dashboard")).data,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setRedeeming(true);
    try {
      const res = await api.post("/api/v1/center/redeem-voucher", { code: code.trim() });
      const v = res.data?.voucher;
      toast.success("Voucher redeemed", {
        description: v?.itemDetails?.itemName ? `Item: ${v.itemDetails.itemName}` : undefined,
      });
      setCode("");
      queryClient.invalidateQueries({ queryKey: ["centerDashboard"] });
    } catch (err) {
      toast.error("Redemption failed", {
        description: err.response?.data?.error || "Please check the code and try again.",
      });
    } finally {
      setRedeeming(false);
    }
  };

  const center = data?.center;
  const stats = data?.stats || { assignedFarmers: 0, redeemedVouchers: 0 };
  const farmers = Array.isArray(data?.farmers) ? data.farmers : [];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Top bar */}
      <header className="flex h-[60px] items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <Leaf size={18} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-extrabold text-slate-900 dark:text-white">
              {user?.centerName || center?.name || "Redemption Center"}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
              {user?.centerCode || center?.code || "AgriPass Center"}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <LogOut size={16} /> Log Out
        </button>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 p-6">
        {isPending ? (
          <div className="flex h-[60vh] items-center justify-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="text-slate-500">Loading center…</span>
          </div>
        ) : isError ? (
          <div className="flex h-[60vh] items-center justify-center">
            <p className="text-red-500">Couldn&apos;t load the center dashboard.</p>
          </div>
        ) : (
          <>
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                <Warehouse size={22} className="text-emerald-600" /> Center Overview
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Farmers assigned to your center and input voucher redemptions.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard label="Assigned Farmers" value={stats.assignedFarmers} icon={Users} accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" />
              <StatCard label="Vouchers Redeemed" value={stats.redeemedVouchers} icon={Ticket} accent="bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400" />
            </div>

            {/* Redeem voucher */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                <ScanLine size={18} className="text-emerald-600" /> Redeem a Voucher
              </h2>
              <p className="mb-4 text-sm text-slate-500">
                Enter the voucher code a farmer presents to mark it redeemed.
              </p>
              <form onSubmit={handleRedeem} className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="VP-XXXX-XXXX"
                  className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 font-mono text-sm uppercase text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={redeeming}
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
                >
                  {redeeming ? "Redeeming…" : "Redeem"}
                </button>
              </form>
            </div>

            {/* Farmers */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Assigned Farmers</h2>
              </div>
              <div className="overflow-x-auto p-2">
                {farmers.length > 0 ? (
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Farmer</TableHead>
                        <TableHead>Farmer ID</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Ward / LGA</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {farmers.map((f) => (
                        <TableRow key={f._id}>
                          <TableCell className="font-medium">
                            {(f.personalDetails?.firstName || "Unknown") + " " + (f.personalDetails?.lastName || "")}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{f.farmerIdNumber || "—"}</TableCell>
                          <TableCell>{f.personalDetails?.phone || "—"}</TableCell>
                          <TableCell>
                            {[f.location?.ward, f.location?.lga].filter(Boolean).join(", ") || "—"}
                          </TableCell>
                          <TableCell className="capitalize">{f.status || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                      <Users size={22} />
                    </div>
                    <p className="font-medium text-slate-600 dark:text-slate-300">No farmers assigned yet</p>
                    <p className="max-w-xs text-sm text-slate-400">
                      Your cooperative assigns farmers to centers by location. They&apos;ll appear here once assigned.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Center;
