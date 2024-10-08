import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Icons } from '@/components/global/icons';

const footerColumns = [
	{
		title: 'Product',
		links: [
			{ title: 'Features', href: '#' },
			{ title: 'Pricing', href: '#' },
			{ title: 'Dashboard', href: '#' },
			{ title: 'Docs', href: '#' },
			{ title: 'Contact', href: '#' },
		],
	},
	{
		title: 'Company',
		links: [
			{ title: 'About us', href: '#' },
			{ title: 'Blog', href: '#' },
			{ title: 'Careers', href: '#' },
			{ title: 'Customers', href: '#' },
			{ title: 'Brand', href: '#' },
		],
	},
	{
		title: 'Resources',
		links: [
			{ title: 'Community', href: '#' },
			{ title: 'Terms of service', href: '#' },
			{ title: 'Privacy policy', href: '#' },
		],
	},
	{
		title: 'Developers',
		links: [
			{ title: 'API', href: '#' },
			{ title: 'Status', href: '#' },
			{ title: 'GitHub', href: '#' },
		],
	},
];

export const Footer = () => {
	return (
		<footer className='border-t border-border/50'>
			<div className='container py-14 px-8 flex flex-col gap-12 md:flex-row md:gap-0'>
				<div className='min-w-[40%] flex flex-row justify-between md:flex-col'>
					<div className='flex flex-col gap-2'>
						<Link
							href='/'
							className='inline-flex items-center gap-2 w-fit'
						>
							<div className='h-5 w-5 bg-logo-gradient rounded-md flex items-center justify-center'>
								<div className='border border-border rounded-md w-fit h-fit bg-background/80'>
									<Icons.logo className='h-4 w-4' />
								</div>
							</div>
							<span className='inline-block text-xs'>
								{siteConfig.name}
							</span>
						</Link>
						<span className='hidden md:inline-block text-foreground text-xs'>
							{siteConfig.description}
						</span>
					</div>
					<div className='flex gap-4 text-foreground'>
						<Icons.twitter className='h-4 w-4' />
						<Icons.gitHub className='h-4 w-4' />
					</div>
				</div>
				<div className='flex flex-wrap justify-between gap-6 md:gap-1 w-full'>
					{footerColumns.map((column) => (
						<div key={column.title} className='flex flex-col gap-3'>
							<h3>{column.title}</h3>
							<ul className='flex flex-col gap-2'>
								{column.links.map((link) => (
									<Link
										href='#'
										key={link.title}
										className='text-sm text-foreground hover:text-primary/75 transition-colors duration-300 w-fit'
									>
										{link.title}
									</Link>
								))}
							</ul>
						</div>
					))}
				</div>
			</div>
		</footer>
	);
};
