import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../../../utils/Api";
import { getStatusBadge } from "../../../utils/Status";
import { formatDate } from "../../../utils/dateFormatter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Building2, FolderKanban } from "lucide-react";
import NewModal from "../../Elements/NewModal";

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
  const [tab, setTab] = useState("organizations");
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendDays, setSuspendDays] = useState(30);
  const [deleteTarget, setDeleteTarget] = useState(null);

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

  const openSuspendModal = (org) => {
    setSuspendTarget(org);
    setSuspendDays(30);
    document.getElementById("adminSuspendOrgModal").showModal();
  };

  const handleSuspendOrganization = async () => {
    if (!suspendTarget) return;
    try {
      await api.put(`/api/v1/admin/suspend_organization/${suspendTarget._id}`, {
        suspendedDays: Number(suspendDays),
      });
      toast.success(`${suspendTarget.name} suspended successfully`);
      queryClient.invalidateQueries({ queryKey: ["admin", "organizations"] });
    } catch (error) {
      toast.error("Failed to suspend organization", {
        description: error.response?.data?.error || "Server not responding",
      });
    } finally {
      setSuspendTarget(null);
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

  const openDeleteModal = (project) => {
    setDeleteTarget(project);
    document.getElementById("adminDeleteProjectModal").showModal();
  };

  const handleDeleteProject = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/v1/admin/delete_project/${deleteTarget._id}`);
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
    } catch (error) {
      toast.error("Failed to delete project", {
        description: error.response?.data?.error || "Server not responding",
      });
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black dark:text-white">Admin Console</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage cooperative organizations and their projects platform-wide.
        </p>
      </div>

      <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 w-fit">
        <button
          onClick={() => setTab("organizations")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            tab === "organizations"
              ? "bg-white dark:bg-gray-700 shadow text-black dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <Building2 size={16} /> Organizations
        </button>
        <button
          onClick={() => setTab("projects")}
          className={`px-4 py-2 text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors ${
            tab === "projects"
              ? "bg-white dark:bg-gray-700 shadow text-black dark:text-white"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          <FolderKanban size={16} /> Projects
        </button>
      </div>

      {tab === "organizations" && (
        <div className="rounded-lg bg-white dark:bg-gray-900 shadow-md p-4 overflow-x-auto">
          {orgsPending ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          ) : orgsError ? (
            <p className="text-center text-red-500 py-8">Failed to load organizations.</p>
          ) : organizations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No organizations found.</p>
          ) : (
            <Table>
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
                    <TableCell>{org.name}</TableCell>
                    <TableCell>{org.subdomain}</TableCell>
                    <TableCell>{org.email}</TableCell>
                    <TableCell>{getStatusBadge(org.status)}</TableCell>
                    <TableCell>{formatDate(org.createdAt)}</TableCell>
                    <TableCell>
                      <button
                        className="btn btn-sm btn-outline btn-warning"
                        disabled={org.status === "suspended"}
                        onClick={() => openSuspendModal(org)}
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
      )}

      {tab === "projects" && (
        <div className="rounded-lg bg-white dark:bg-gray-900 shadow-md p-4 overflow-x-auto">
          {projectsPending ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          ) : projectsError ? (
            <p className="text-center text-red-500 py-8">Failed to load projects.</p>
          ) : projects.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No projects found.</p>
          ) : (
            <Table>
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
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.organizationId?.name || "Unknown"}</TableCell>
                    <TableCell className="capitalize">{project.type}</TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                    <TableCell className="flex gap-2">
                      <button
                        className="btn btn-sm btn-outline"
                        disabled={project.status === "suspended"}
                        onClick={() => handleDeactivateProject(project._id)}
                      >
                        Suspend
                      </button>
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => openDeleteModal(project)}
                      >
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      {/* Suspend Organization Modal (needs a days input, so built inline rather than via the generic confirm-only modal) */}
      <dialog id="adminSuspendOrgModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg">Suspend Organization</h3>
          <p className="py-2">
            Suspend <strong>{suspendTarget?.name}</strong> for how many days?
          </p>
          <input
            type="number"
            min="1"
            value={suspendDays}
            onChange={(e) => setSuspendDays(e.target.value)}
            className="input input-bordered w-full"
          />
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">Cancel</button>
            </form>
            <button className="btn btn-warning" onClick={handleSuspendOrganization}>
              Suspend
            </button>
          </div>
        </div>
      </dialog>

      <NewModal
        title="Delete Project"
        description={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action cannot be undone.`}
        modalId="adminDeleteProjectModal"
        onConfirm={handleDeleteProject}
        isDangerous={true}
        confirmButtonText="Delete Project"
      />
    </div>
  );
};

export default Admin;
