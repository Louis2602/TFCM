import { Icons } from '@/components/global/icons';

interface DashboardNavLink {
	icon: keyof typeof Icons;
	href: string;
	label: string;
}

interface DashboardNav {
	title: string;
	links: DashboardNavLink[];
}

export interface DashboardConfig {
	nav: DashboardNav[];
}

export interface Service {
	title: string;
	description: string;
	icon: keyof typeof Icons;
}
