import { cn } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

export interface HintProps {
	className?: string;
	label: string;
	children: React.ReactNode;
	side?: 'top' | 'bottom' | 'left' | 'right';
	align?: 'start' | 'center' | 'end';
	sideOffset?: number;
	alignOffset?: number;
}

export const Hint = ({
	className,
	label,
	children,
	side,
	align,
	sideOffset,
	alignOffset,
}: HintProps) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={100}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent
					className={cn(
						'text-white bg-black border-black',
						className
					)}
					side={side}
					align={align}
					sideOffset={sideOffset}
					alignOffset={alignOffset}
				>
					<p className='font-semibold capitalize m-0'>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
