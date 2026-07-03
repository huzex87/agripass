import {
  ChartColumn,
  Home,
  NotepadText,
  Package,
  PackagePlus,
  Settings,
  ShoppingBag,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

export const navbarLinks = [
  {
    title: "Dashboard",
    links: [
      {
        label: "Dashboard",
        icon: Home,
        path: "dashboard",
      },
      // {
      //   label: "Analytics",
      //   icon: ChartColumn,
      //   path: "/analytics",
      // },
      // {
      //   label: "Reports",
      //   icon: NotepadText,
      //   path: "/reports",
      // },
    ],
  },
  {
    title: "Resource",
    links: [
      {
        label: "Projects",
        icon: Users,
        path: "projects",
      },
      // {
      //   label: "Manage Projects",
      //   icon: UserPlus,
      //   path: "/new-customer",
      // },
      // {
      //   label: "Verified customers",
      //   icon: UserCheck,
      //   path: "/verified-customers",
      // },
    ],
  },
  {
    title: "Applications",
    links: [
      // {
      //   label: "Review Applications",
      //   icon: Package,
      //   path: "/products",
      // },
      {
        label: "Manage Applications",
        icon: ShoppingBag,
        path: "applications",
      },
    ],
  },
  {
    title: "Agro Operations",
    links: [
      {
        label: "Voucher Verification",
        icon: Package,
        path: "voucher-verify",
      },
      {
        label: "Crop Recovery Ledger",
        icon: PackagePlus,
        path: "crop-recovery",
      },
    ],
  },
  {
    title: "Settings",
    links: [
      {
        label: "Settings",
        icon: Settings,
        path: "settings",
      },
    ],
  },
];
