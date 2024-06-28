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
          icon: "textFile",
          label: "Content",
          href: "/content",
        },
        {
          icon: "media",
          label: "Media",
          href: "/media",
        },
        {
          icon: "wand",
          label: "SEO Wizard",
          href: "/seo-wizard",
        },
        {
          icon: "template",
          label: "Templates",
          href: "/templates",
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
