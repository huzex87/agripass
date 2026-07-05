import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Leaf,
  LogOut,
  Users,
  Loader2,
  ClipboardCheck,
  UserPlus,
  MapPin,
  Send,
} from "lucide-react";
import api from "../../../utils/Api";
import { useAuthentication } from "../../../utils/Auth";
import LocationPicker from "../../../components/ui/LocationPicker";
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

const emptyFarmer = {
  firstName: "",
  lastName: "",
  gender: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  password: "",
  idType: "national_id",
  idNumber: "",
  location: { state: "", lga: "", ward: "", pollingUnit: "" },
};

const Collector = () => {
  const { logout, user } = useAuthentication();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyFarmer);
  const [saving, setSaving] = useState(false);
  const [applyingId, setApplyingId] = useState(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["collectorDashboard"],
    queryFn: async () => (await api.get("/api/v1/collector/dashboard")).data,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const { data: projectData } = useQuery({
    queryKey: ["collectorProjects"],
    queryFn: async () => (await api.get("/api/v1/collector/projects")).data,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const collector = data?.collector;
  const stats = data?.stats || { registeredFarmers: 0 };
  const farmers = Array.isArray(data?.farmers) ? data.farmers : [];
  const projects = Array.isArray(projectData?.projects) ? projectData.projects : [];
  const assigned = Array.isArray(collector?.assignedLocations) ? collector.assignedLocations : [];

  const handleRegister = async (e) => {
    e.preventDefault();
    const { firstName, lastName, gender, phone, email, password, idType, idNumber, location } = form;
    if (!firstName || !lastName || !gender || !phone || !email || !password || !idType || !idNumber || !location.state || !location.lga) {
      toast.error("Please fill all required fields (including State and LGA)");
      return;
    }
    setSaving(true);
    try {
      await api.post("/api/v1/collector/register-farmer", {
        firstName,
        lastName,
        gender,
        dateOfBirth: form.dateOfBirth,
        phone,
        email,
        password,
        idType,
        idNumber,
        state: location.state,
        lga: location.lga,
        ward: location.ward,
        pollingUnit: location.pollingUnit,
      });
      toast.success("Farmer registered", { description: `${firstName} ${lastName} added to your list.` });
      setShowModal(false);
      setForm(emptyFarmer);
      queryClient.invalidateQueries({ queryKey: ["collectorDashboard"] });
    } catch (err) {
      toast.error("Registration failed", {
        description: err.response?.data?.error || "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async (farmerId, projectId) => {
    if (!projectId) return;
    setApplyingId(farmerId);
    try {
      await api.post("/api/v1/collector/apply", { beneficiaryId: farmerId, projectId });
      toast.success("Application submitted on behalf of the farmer");
    } catch (err) {
      toast.error("Application failed", {
        description: err.response?.data?.error || "Please try again.",
      });
    } finally {
      setApplyingId(null);
    }
  };

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
              {user?.collectorName || (collector ? `${collector.firstName} ${collector.lastName}` : "Field Agent")}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">AgriPass Field Agent</p>
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
            <span className="text-slate-500">Loading your portal…</span>
          </div>
        ) : isError ? (
          <div className="flex h-[60vh] items-center justify-center">
            <p className="text-red-500">Couldn&apos;t load your agent dashboard.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
                  <ClipboardCheck size={22} className="text-emerald-600" /> Field Agent Portal
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Register farmers in your assigned areas and apply for programs on their behalf.
                </p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500"
              >
                <UserPlus size={16} /> Register Farmer
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <StatCard label="Farmers Registered" value={stats.registeredFarmers} icon={Users} accent="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" />
              <StatCard label="Assigned Areas" value={assigned.length} icon={MapPin} accent="bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400" />
            </div>

            {/* Assigned areas */}
            {assigned.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Your Assigned Coverage</h2>
                <div className="flex flex-wrap gap-1.5">
                  {assigned.map((a, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    >
                      <MapPin size={11} />
                      {[a.pollingUnit, a.ward, a.lga, a.state].filter(Boolean).join(" / ") || "—"}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Farmers */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">My Registered Farmers</h2>
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
                        <TableHead>Apply for Program</TableHead>
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
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <select
                                defaultValue=""
                                disabled={applyingId === f._id || projects.length === 0}
                                onChange={(e) => handleApply(f._id, e.target.value)}
                                className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                              >
                                <option value="" disabled>
                                  {projects.length === 0 ? "No programs" : "Select program…"}
                                </option>
                                {projects.map((p) => (
                                  <option key={p._id} value={p._id}>
                                    {p.name}
                                  </option>
                                ))}
                              </select>
                              {applyingId === f._id && <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                      <Users size={22} />
                    </div>
                    <p className="font-medium text-slate-600 dark:text-slate-300">No farmers registered yet</p>
                    <p className="max-w-xs text-sm text-slate-400">
                      Tap &ldquo;Register Farmer&rdquo; to enroll a farmer in one of your assigned areas.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Register farmer modal */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <UserPlus size={20} className="text-emerald-600" /> Register a Farmer
            </h2>
            <p className="mb-4 text-xs text-slate-400">
              Enroll a farmer on their behalf. Their location must fall within your assigned coverage.
            </p>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">First Name</label>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Musa" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Last Name</label>
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Ibrahim" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="">Select…</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Date of Birth</label>
                  <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="+234..." />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="farmer@email.com" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">ID Type</label>
                  <select value={form.idType} onChange={(e) => setForm({ ...form, idType: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option value="national_id">National ID (NIN)</option>
                    <option value="passport">Passport</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">ID Number</label>
                  <input value={form.idNumber} onChange={(e) => setForm({ ...form, idNumber: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="12345678901" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-slate-600 dark:text-slate-300">Temporary Password (for the farmer)</label>
                  <input type="text" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" placeholder="Give the farmer these details to log in later" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold text-slate-600 dark:text-slate-300">Farmer Location</label>
                <LocationPicker
                  value={form.location}
                  onChange={(location) => setForm((f) => ({ ...f, location }))}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={15} />}
                  {saving ? "Registering…" : "Register Farmer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collector;
