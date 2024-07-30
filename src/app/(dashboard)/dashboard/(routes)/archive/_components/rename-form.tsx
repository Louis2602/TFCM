'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { CategorySchema } from '@/lib/validations/archive';

import { Button, IconButton } from '@/components/ui/button';
import { Icons } from '@/components/global/icons';
import { Input } from '@/components/ui/input';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter,
} from '@/components/ui/dialog';

type FormData = z.infer<typeof CategorySchema>;

export type RenameContentProps = {
	currentName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: FormData) => void;
};

export const RenameContentForm = (props: RenameContentProps) => {
	const form = useForm<FormData>({
		resolver: zodResolver(CategorySchema),
		defaultValues: {
			name: props.currentName,
		},
	});

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Rename Content</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(props.onSubmit)}
						className="flex flex-col gap-6 px-4 py-2"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Rename content</FormLabel>
									<FormControl>
										<Input type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<DialogClose className="mx-6">Cancel</DialogClose>
							<Button>Rename</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
