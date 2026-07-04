import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Warehouse, MapPin, Loader2, Trash2, RefreshCw } from "lucide-react";
import api from "../../../utils/Api";
import { getStatusBadge } from "../../../utils/Status";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  contactPhone: "",
  coverage: [{ state: "", lga: "", ward: "" }],
};

const RedemptionCenters = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: ["centers"],
    queryFn: async () => (await api.get("/api/v1/centers")).data,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const centers = Array.isArray(data?.centers) ? data.centers : [];

  const updateCoverage = (i, field, value) => {
    setForm((f) => {
      const coverage = [...f.coverage];
      coverage[i] = { ...coverage[i], [field]: value };
      return { ...f, coverage };
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Name, email and password are required");
      return;
    }
    setSaving(true);
    try {
      const coverage = form.coverage.filter((c) => c.state || c.lga || c.ward);
      await api.post("/api/v1/centers", { ...form, coverage });
      toast.success("Redemption center created");
      setShowModal(false);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["centers"] });
    } catch (err) {
      toast.error("Failed to create center", {
        description: err.response?.data?.error || "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (center, action) => {
    try {
      await api.put(`/api/v1/centers/${center._id}/${action}`);
      toast.success(`Center ${action === "suspend" ? "suspended" : "activated"}`);
      queryClient.invalidateQueries({ queryKey: ["centers"] });
    } catch (err) {
      toast.error("Action failed", { description: err.response?.data?.error || "Please try again." });
    }
  };

  const handleAssign = async () => {
    setAssigning(true);
    try {
      const res = await api.post("/api/v1/centers/assign-farmers");
      toast.success("Farmers assigned", { description: res.data?.message });
      queryClient.invalidateQueries({ queryKey: ["centers"] });
    } catch (err) {
      toast.error("Assignment failed", { description: err.response?.data?.error || "Please try again." });
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <Warehouse size={22} className="text-emerald-600" /> Redemption Centers
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create centers and assign farmers to them by location.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAssign}
            disabled={assigning}
            className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw size={16} className={assigning ? "animate-spin" : ""} /> Assign Farmers
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
          >
            <Plus size={16} /> New Center
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto p-2">
          {isPending ? (
            <div className="flex items-center justify-center gap-2 py-14">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="text-slate-500">Loading centers…</span>
            </div>
          ) : isError ? (
            <p className="py-14 text-center text-red-500">Couldn&apos;t load centers.</p>
          ) : centers.length > 0 ? (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {centers.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="font-mono text-xs">{c.code}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(c.coverage || []).length > 0 ? (
                          c.coverage.map((a, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            >
                              <MapPin size={10} />
                              {[a.ward, a.lga, a.state].filter(Boolean).join(" / ") || "—"}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No coverage set</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(c.status)}</TableCell>
                    <TableCell>
                      {c.status === "active" ? (
                        <button
                          onClick={() => handleStatus(c, "suspend")}
                          className="rounded-lg border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-50"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatus(c, "activate")}
                          className="rounded-lg border border-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                        >
                          Activate
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Warehouse size={22} />
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-300">No redemption centers yet</p>
              <p className="max-w-xs text-sm text-slate-400">
                Create your first center and set which areas it covers.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">New Redemption Center</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Center Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Batagarawa Center" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Contact Phone</label>
                  <input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="+234..." />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Login Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="center@coop.org" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Login Password</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="••••••••" />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Coverage Areas</label>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, coverage: [...f.coverage, { state: "", lga: "", ward: "" }] }))}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    + Add area
                  </button>
                </div>
                <p className="mb-2 text-[11px] text-slate-400">
                  Match how farmers register their location. Leave ward/LGA blank to cover a whole LGA/state.
                </p>
                <div className="space-y-2">
                  {form.coverage.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={c.state} onChange={(e) => updateCoverage(i, "state", e.target.value)} placeholder="State" className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                      <input value={c.lga} onChange={(e) => updateCoverage(i, "lga", e.target.value)} placeholder="LGA" className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                      <input value={c.ward} onChange={(e) => updateCoverage(i, "ward", e.target.value)} placeholder="Ward" className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                      {form.coverage.length > 1 && (
                        <button type="button" onClick={() => setForm((f) => ({ ...f, coverage: f.coverage.filter((_, idx) => idx !== i) }))} className="text-slate-400 hover:text-red-500">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
                  {saving ? "Creating…" : "Create Center"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedemptionCenters;
