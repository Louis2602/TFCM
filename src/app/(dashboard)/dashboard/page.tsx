import type { Metadata } from 'next';
import Overview from './_components/overview';

export const metadata: Metadata = {
	title: 'Dashboard',
};

export default async function DashboardPage() {
	return <Overview />;
}
