import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  FolderKanban,
  CircleCheck,
  BadgeCheck,
  Wallet,
  Loader2,
  Plus,
  ClipboardList,
  Ticket,
  ArrowRight,
} from "lucide-react";
import api from "../../../utils/Api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getStatusBadge } from "../../../utils/Status";
import { dashboardLoaderFunction } from "../../../utils/loaderFunction";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const StatCard = ({ label, value, icon: Icon, accent }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
  </div>
);

const Organization = () => {
  const navigate = useNavigate();
  const { subdomain } = useParams();

  const {
    data: resourcesData,
    isPending,
    isError,
    error,
  } = useQuery(dashboardLoaderFunction());

  const { data: disbursementsData } = useQuery({
    queryKey: ["disbursements"],
    queryFn: async () => (await api.get("/api/v1/disbursements")).data,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const { data: beneficiariesData } = useQuery({
    queryKey: ["recentBeneficiaries"],
    queryFn: async () => (await api.get("/api/v1/beneficiaries")).data,
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (isPending) {
    return (
      <div className="flex h-[60vh] items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="text-slate-500">Loading your dashboard…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-red-500">Couldn&apos;t load the dashboard: {error?.message}</p>
      </div>
    );
  }

  const r = resourcesData?.responseData || {};
  const totalActive = r.totalActive || 0;
  const totalCompleted = r.totalCompleted || 0;
  const totalApproved = disbursementsData?.responseData?.totalApproved || 0;
  const totalDisbursed = disbursementsData?.responseData?.totalCompleted || 0;
  const beneficiaries = Array.isArray(beneficiariesData) ? beneficiariesData : [];

  const stats = [
    { label: "Active Projects", value: totalActive, icon: FolderKanban, accent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
    { label: "Completed Projects", value: totalCompleted, icon: CircleCheck, accent: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400" },
    { label: "Approved Disbursements", value: totalApproved, icon: BadgeCheck, accent: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400" },
    { label: "Total Disbursed", value: totalDisbursed, icon: Wallet, accent: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" },
  ];

  const quickActions = [
    { label: "New Project", desc: "Launch an input program", icon: Plus, to: `/${subdomain}/newProject` },
    { label: "Review Applications", desc: "Approve or reject farmers", icon: ClipboardList, to: `/${subdomain}/applications` },
    { label: "Verify Voucher", desc: "Redeem at a center", icon: Ticket, to: `/${subdomain}/voucher-verify` },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {greeting()}, {subdomain} 👋
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Here&apos;s what&apos;s happening across your cooperative today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.to)}
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-700"
          >
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <a.icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{a.label}</p>
              <p className="truncate text-xs text-slate-400">{a.desc}</p>
            </div>
            <ArrowRight
              size={18}
              className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-600"
            />
          </button>
        ))}
      </div>

      {/* Recent applications */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Recent Applications
          </h2>
          <button
            onClick={() => navigate(`/${subdomain}/applications`)}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View all
          </button>
        </div>
        <div className="overflow-x-auto p-2">
          {beneficiaries.length > 0 ? (
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Farmer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {beneficiaries.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell className="font-medium">
                      {(b.beneficiaryId?.personalDetails?.firstName || "Unknown") +
                        " " +
                        (b.beneficiaryId?.personalDetails?.lastName || "")}
                    </TableCell>
                    <TableCell>{b.beneficiaryId?.personalDetails?.email || "N/A"}</TableCell>
                    <TableCell>{b.projectId?.name || "N/A"}</TableCell>
                    <TableCell>
                      {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : "N/A"}
                    </TableCell>
                    <TableCell>{getStatusBadge(b.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <ClipboardList size={22} />
              </div>
              <p className="font-medium text-slate-600 dark:text-slate-300">
                No applications yet
              </p>
              <p className="max-w-xs text-sm text-slate-400">
                Once farmers apply to your projects, they&apos;ll show up here for review.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Organization;
