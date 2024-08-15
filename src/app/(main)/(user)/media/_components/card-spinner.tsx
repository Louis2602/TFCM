import { Icons } from '@/components/global/icons';

export function CardSpinner() {
	return (
		<div className='flex items-center justify-center p-6'>
			<Icons.spinner
				className="h-6 w-6 animate-spin"
				aria-hidden="true"
			/>
		</div>
	);
}
