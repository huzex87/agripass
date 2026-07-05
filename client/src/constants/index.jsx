import {
  LayoutDashboard,
  FolderKanban,
  ClipboardList,
  Ticket,
  Wheat,
  Warehouse,
  ClipboardCheck,
} from "lucide-react";

// Sidebar navigation for the cooperative dashboard.
// Paths are RELATIVE to /:subdomain so they resolve inside the dashboard layout.
export const navbarLinks = [
  {
    title: "Menu",
    links: [
      {
        label: "Overview",
        icon: LayoutDashboard,
        path: "dashboard",
      },
    ],
  },
  {
    title: "Programs",
    links: [
      {
        label: "Projects",
        icon: FolderKanban,
        path: "projects",
      },
      {
        label: "Applications",
        icon: ClipboardList,
        path: "applications",
      },
    ],
  },
  {
    title: "Disbursement",
    links: [
      {
        label: "Vouchers",
        icon: Ticket,
        path: "voucher-verify",
      },
      {
        label: "Crop Recovery",
        icon: Wheat,
        path: "crop-recovery",
      },
    ],
  },
  {
    title: "Network",
    links: [
      {
        label: "Redemption Centers",
        icon: Warehouse,
        path: "centers",
      },
      {
        label: "Field Agents",
        icon: ClipboardCheck,
        path: "collectors",
      },
    ],
  },
];
