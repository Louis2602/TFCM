import { authFeatureItems } from '@/config/auth-features';
import { AuthFeature } from '@/components/auth/auth-feature';
import type { Metadata } from 'next';
import { SignUp } from '@clerk/nextjs';

export const metadata: Metadata = {
	title: 'Sign up',
	description: 'Create new account',
};

export default function SignUpPage() {
	return (
		<div className='relative container py-16 md:py-24 flex flex-col items-center'>
			<div className='max-w-[51.25rem] w-full p-6 border border-border/50 rounded-lg bg-border/20 flex flex-col justify-between md:flex-row'>
				<div className='hidden px-6 w-full md:flex flex-col gap-12 pt-12'>
					{authFeatureItems.map((feature) => (
						<AuthFeature key={feature.label} {...feature} />
					))}
				</div>
				<div className='px-6 w-full flex flex-col'>
					<SignUp />
				</div>
			</div>
		</div>
	);
}
