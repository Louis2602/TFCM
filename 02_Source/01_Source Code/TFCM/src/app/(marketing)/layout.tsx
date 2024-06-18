import { Footer } from '@/components/global/footer';
import { Header } from '@/components/global/header';
import { getCurrentUser } from '@/lib/session';
interface MarketingLayoutProps {
	children: React.ReactNode;
}

export default async function MarketingLayout({
	children,
}: MarketingLayoutProps) {
	const currentUser = await getCurrentUser();

	return (
		<>
			<Header currentUser={currentUser} />
			<main className='pt-nav-height'>{children}</main>
			<Footer />
		</>
	);
}
