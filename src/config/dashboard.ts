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
          icon: "pen",
          label: "Editor",
          href: "/editor",
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
        {
          icon: "kanban",
          label: "Task board",
          href: "/kanban",
        },
        {
          icon: "workspace",
          label: "Workspace",
          href: "/workspace",
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
          icon: "link",
          label: "Shared Links",
          href: "/dashboard/shared-links",
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

export const adminDashboardConfig: DashboardConfig = {
  nav: [
    {
      title: "Services",
      links: [
        {
          icon: "dashboard",
          label: "Dashboard",
          href: "/admin/dashboard",
        },
        {
          icon: "user",
          label: "Users",
          href: "/admin/dashboard/users",
        },
        {
          icon: "template",
          label: "Posts",
          href: "/admin/dashboard/posts",
        },
      ],
    },
    {
      title: "Account",
      links: [
        {
          icon: "settings",
          label: "Settings",
          href: "/admin/dashboard/settings",
        },
      ],
    },
  ],
};
