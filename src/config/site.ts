export const siteConfig = {
	name: 'TFCM',
	description: 'AI Powered Copywriting Tool for Content Management',
	url: process.env.APP_URL || 'http://localhost:3000',
	mainNav: [
		{
			label: 'Product',
			href: '#services',
		},
		{
			label: 'Services',
			href: '#services',
		},
		{
			label: 'Pricing',
			href: '#pricing',
		},
		{
			label: 'Customers',
			href: '#testimonials',
		},
		{
			label: 'Contact',
			href: '#',
		},
	],
};
