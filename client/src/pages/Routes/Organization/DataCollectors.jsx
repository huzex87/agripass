import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, ClipboardCheck, MapPin, Loader2, Trash2 } from "lucide-react";
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
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  assignedLocations: [{ state: "", lga: "", ward: "", pollingUnit: "" }],
};

const DataCollectors = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: ["collectors"],
    queryFn: async () => (await api.get("/api/v1/collectors")).data,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const collectors = Array.isArray(data?.collectors) ? data.collectors : [];

  const updateArea = (i, field, value) => {
    setForm((f) => {
      const assignedLocations = [...f.assignedLocations];
      assignedLocations[i] = { ...assignedLocations[i], [field]: value };
      return { ...f, assignedLocations };
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      toast.error("First name, last name, email and password are required");
      return;
    }
    setSaving(true);
    try {
      const assignedLocations = form.assignedLocations.filter(
        (a) => a.state || a.lga || a.ward || a.pollingUnit
      );
      await api.post("/api/v1/collectors", { ...form, assignedLocations });
      toast.success("Field agent created");
      setShowModal(false);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["collectors"] });
    } catch (err) {
      toast.error("Failed to create field agent", {
        description: err.response?.data?.error || "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (collector, action) => {
    try {
      await api.put(`/api/v1/collectors/${collector._id}/${action}`);
      toast.success(`Field agent ${action === "suspend" ? "suspended" : "activated"}`);
      queryClient.invalidateQueries({ queryKey: ["collectors"] });
    } catch (err) {
      toast.error("Action failed", { description: err.response?.data?.error || "Please try again." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <ClipboardCheck size={22} className="text-emerald-600" /> Field Agents
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Register data collectors and assign them locations to enroll farmers on their behalf.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
        >
          <Plus size={16} /> New Field Agent
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto p-2">
          {isPending ? (
            <div className="flex items-center justify-center gap-2 py-14">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              <span className="text-slate-500">Loading field agents…</span>
            </div>
          ) : isError ? (
            <p className="py-14 text-center text-red-500">Couldn&apos;t load field agents.</p>
          ) : collectors.length > 0 ? (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Assigned Areas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collectors.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">{c.firstName} {c.lastName}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone || "—"}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(c.assignedLocations || []).length > 0 ? (
                          c.assignedLocations.map((a, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            >
                              <MapPin size={10} />
                              {[a.ward, a.lga, a.state].filter(Boolean).join(" / ") || "—"}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No areas set</span>
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
                <ClipboardCheck size={22} />
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-300">No field agents yet</p>
              <p className="max-w-xs text-sm text-slate-400">
                Add your first data collector and assign the areas they can register farmers in.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">New Field Agent</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">First Name</label>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Aisha" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Last Name</label>
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Bello" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Login Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="agent@coop.org" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Login Password</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="••••••••" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="+234..." />
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Assigned Areas</label>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, assignedLocations: [...f.assignedLocations, { state: "", lga: "", ward: "", pollingUnit: "" }] }))}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    + Add area
                  </button>
                </div>
                <p className="mb-2 text-[11px] text-slate-400">
                  The agent can only register farmers in these areas. Leave ward/LGA blank to cover a whole LGA/state.
                </p>
                <div className="space-y-2">
                  {form.assignedLocations.map((a, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={a.state} onChange={(e) => updateArea(i, "state", e.target.value)} placeholder="State" className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                      <input value={a.lga} onChange={(e) => updateArea(i, "lga", e.target.value)} placeholder="LGA" className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                      <input value={a.ward} onChange={(e) => updateArea(i, "ward", e.target.value)} placeholder="Ward" className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                      {form.assignedLocations.length > 1 && (
                        <button type="button" onClick={() => setForm((f) => ({ ...f, assignedLocations: f.assignedLocations.filter((_, idx) => idx !== i) }))} className="text-slate-400 hover:text-red-500">
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
                  {saving ? "Creating…" : "Create Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataCollectors;
