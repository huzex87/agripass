import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../utils/Api";
import { getStatusBadge } from "../../../utils/Status";
import { formatDate } from "../../../utils/dateFormatter";
import { useAuthentication } from "../../../utils/Auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Building2,
  FolderKanban,
  Leaf,
  LogOut,
  ShieldAlert,
  Trash2,
} from "lucide-react";

const fetchOrganizations = async () => {
  const res = await api.get("/api/v1/admin/organizations");
  return res.data.organizations || [];
};

const fetchProjects = async () => {
  const res = await api.get("/api/v1/admin/projects");
  return res.data.responseData || {};
};

const Admin = () => {
  const queryClient = useQueryClient();
  const { logout, user } = useAuthentication();
  const [tab, setTab] = useState("organizations");
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendDays, setSuspendDays] = useState(30);
  const [suspending, setSuspending] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    data: organizations,
    isPending: orgsPending,
    isError: orgsError,
  } = useQuery({
    queryKey: ["admin", "organizations"],
    queryFn: fetchOrganizations,
    retry: false,
  });

  const {
    data: projectsData,
    isPending: projectsPending,
    isError: projectsError,
  } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: fetchProjects,
    retry: false,
  });

  const projects = projectsData?.projects || [];

  const handleSuspendOrganization = async () => {
    if (!suspendTarget) return;
    setSuspending(true);
    try {
      await api.put(`/api/v1/admin/suspend_organization/${suspendTarget._id}`, {
        suspendedDays: Number(suspendDays),
      });
      toast.success(`${suspendTarget.name} suspended successfully`);
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations"] });
      setSuspendTarget(null);
    } catch (error) {
      toast.error("Failed to suspend organization", {
        description: error.response?.data?.error || "Server not responding",
      });
    } finally {
      setSuspending(false);
    }
  };

  const handleDeactivateProject = async (projectId) => {
    try {
      await api.put(`/api/v1/admin/deactivate_project/${projectId}`);
      toast.success("Project deactivated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
    } catch (error) {
      toast.error("Failed to deactivate project", {
        description: error.response?.data?.error || "Server not responding",
      });
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/api/v1/admin/delete_project/${deleteTarget._id}`);
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
      setDeleteTarget(null);
    } catch (error) {
      toast.error("Failed to delete project", {
        description: error.response?.data?.error || "Server not responding",
      });
    } finally {
      setDeleting(false);
    }
  };

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setTab(id)}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
        tab === id
          ? "bg-emerald-600 text-white shadow"
          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );

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
              {user?.adminName || "Platform Admin"}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">AgriPass Admin Console</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
        >
          <LogOut size={16} /> Log Out
        </button>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 p-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
            <ShieldAlert size={22} className="text-emerald-600" /> Admin Console
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage cooperative organizations and their projects platform-wide.
          </p>
        </div>

        <div className="flex w-fit gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          <TabButton id="organizations" icon={Building2} label="Organizations" />
          <TabButton id="projects" icon={FolderKanban} label="Projects" />
        </div>

        {tab === "organizations" && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto p-2">
              {orgsPending ? (
                <div className="flex items-center justify-center gap-2 py-14">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                  <span className="text-slate-500">Loading organizations…</span>
                </div>
              ) : orgsError ? (
                <p className="py-14 text-center text-red-500">Failed to load organizations.</p>
              ) : organizations.length === 0 ? (
                <p className="py-14 text-center text-slate-500">No organizations found.</p>
              ) : (
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Subdomain</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {organizations.map((org) => (
                      <TableRow key={org._id}>
                        <TableCell className="font-medium">{org.name}</TableCell>
                        <TableCell className="font-mono text-xs">{org.subdomain}</TableCell>
                        <TableCell>{org.email}</TableCell>
                        <TableCell>{getStatusBadge(org.status)}</TableCell>
                        <TableCell>{formatDate(org.createdAt)}</TableCell>
                        <TableCell>
                          <button
                            disabled={org.status === "suspended"}
                            onClick={() => {
                              setSuspendTarget(org);
                              setSuspendDays(30);
                            }}
                            className="rounded-lg border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-amber-500/40 dark:text-amber-400 dark:hover:bg-amber-950/30"
                          >
                            Suspend
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        )}

        {tab === "projects" && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto p-2">
              {projectsPending ? (
                <div className="flex items-center justify-center gap-2 py-14">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                  <span className="text-slate-500">Loading projects…</span>
                </div>
              ) : projectsError ? (
                <p className="py-14 text-center text-red-500">Failed to load projects.</p>
              ) : projects.length === 0 ? (
                <p className="py-14 text-center text-slate-500">No projects found.</p>
              ) : (
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project._id}>
                        <TableCell className="font-medium">{project.name}</TableCell>
                        <TableCell>{project.organizationId?.name || "Unknown"}</TableCell>
                        <TableCell className="capitalize">{project.type}</TableCell>
                        <TableCell>{getStatusBadge(project.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <button
                              disabled={project.status === "suspended"}
                              onClick={() => handleDeactivateProject(project._id)}
                              className="rounded-lg border border-amber-300 px-3 py-1 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-amber-500/40 dark:text-amber-400 dark:hover:bg-amber-950/30"
                            >
                              Suspend
                            </button>
                            <button
                              onClick={() => setDeleteTarget(project)}
                              className="rounded-lg border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-950/30"
                            >
                              Delete
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Suspend organization modal */}
      {suspendTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <ShieldAlert size={20} className="text-amber-500" /> Suspend Organization
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Suspend <strong className="text-slate-800 dark:text-slate-200">{suspendTarget.name}</strong> for how many days?
            </p>
            <input
              type="number"
              min="1"
              value={suspendDays}
              onChange={(e) => setSuspendDays(e.target.value)}
              className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setSuspendTarget(null)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSuspendOrganization}
                disabled={suspending}
                className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
              >
                {suspending ? "Suspending…" : "Suspend"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete project modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900">
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <Trash2 size={20} className="text-red-500" /> Delete Project
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Permanently delete <strong className="text-slate-800 dark:text-slate-200">{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
