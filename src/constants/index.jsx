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
        path: "/",
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
    title: "Manage Resource",
    links: [
      {
        label: "Create New Resources",
        icon: Users,
        path: "/customers",
      },
      {
        label: "Delete Resources",
        icon: UserPlus,
        path: "/new-customer",
      },
      // {
      //   label: "Verified customers",
      //   icon: UserCheck,
      //   path: "/verified-customers",
      // },
    ],
  },
  {
    title: "Manage Applications",
    links: [
      {
        label: "Review Applications",
        icon: Package,
        path: "/products",
      },
      {
        label: "Delete/Reject Applications",
        icon: ShoppingBag,
        path: "/inventory",
      },
    ],
  },
  {
    title: "Track Resources",
    links: [
      {
        label: "Funds Disbursed",
        icon: Package,
        path: "/products",
      },
      {
        label: "Goods Disbursed",
        icon: PackagePlus,
        path: "/new-product",
      },
    ],
  },
  {
    title: "Settings",
    links: [
      {
        label: "Settings",
        icon: Settings,
        path: "/settings",
      },
    ],
  },
];
