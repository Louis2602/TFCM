import { cn } from '@/lib/utils';
import { Icons } from './icons';

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
	size?: number;
	className?: string;
}

export const Loader = ({ size = 24, className, ...props }: ISVGProps) => {
	return (
		<Icons.spinner
			className={cn('mr-2 h-4 w-4 animate-spin', className)}
			size={size}
			aria-hidden='true'
		/>
	);
};
