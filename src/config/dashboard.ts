import { DashboardConfig } from "@/types/config";

export const dashboardConfig: DashboardConfig = {
  nav: [
    {
      title: "Services",
      links: [
        {
          icon: "dashboard",
          label: "Dashboard",
          href: "/dashboard",
        },
        {
          icon: "languages",
          label: "Grammar Checker",
          href: "/grammar-checker",
        },
        {
          icon: "notebook",
          label: "Content Writer",
          href: "/content-writer",
        },
        {
          icon: "wand",
          label: "SEO Wizard",
          href: "/seo-wizard",
        },
        {
          icon: "pen",
          label: "Editor",
          href: "/editor",
        },
      ],
    },
    {
      title: "Account",
      links: [
        {
          icon: "database",
          label: "Archive",
          href: "/dashboard/archive",
        },
        {
          icon: "settings",
          label: "Settings",
          href: "/dashboard/settings",
        },
        {
          icon: "receipt",
          label: "Credits",
          href: "/dashboard/credits",
        },
      ],
    },
  ],
};
