'use client';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ConfirmProps = {
	title: string;
	description?: string;
	confirmText?: string;
	variant?: 'default' | 'destructive';
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
};

export const ConfirmDialog = (props: ConfirmProps) => {
	return (
		<AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{props.title}</AlertDialogTitle>
					<AlertDialogDescription>
						{props.description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className={cn(
							buttonVariants({
								variant: props.variant
									? props.variant
									: 'default',
							})
						)}
						onClick={props.onConfirm}
					>
						{props.confirmText ? props.confirmText : 'Continue'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
