'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CategorySchema } from '@/lib/validations/archive';

import { Button, IconButton } from '@/components/ui/button';
import { Icons } from '@/components/global/icons';
import { Input } from '@/components/ui/input';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

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
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogFooter,
} from '@/components/ui/dialog';

type FormData = z.infer<typeof CategorySchema>;

export type CategoryFormProps = {
	currentName?: string;
	type: 'Create' | 'Update';
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: FormData) => void;
};

export const CategoryForm = (props: CategoryFormProps) => {
	const form = useForm<FormData>({
		resolver: zodResolver(CategorySchema),
		defaultValues: {
			name: props.currentName ? props.currentName : '',
		},
	});

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			{false && (
				<DialogTrigger>
					{props.type == 'Update' && (
						<DropdownMenuItem className="flex flex-row gap-2">
							<Icons.edit /> Update
						</DropdownMenuItem>
					)}
					{props.type == 'Create' && (
						<Button variant="default" size="sm">
							Add Category
						</Button>
					)}
				</DialogTrigger>
			)}
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{props.type} Category
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(props.onSubmit)}
						className="flex flex-col gap-6 px-4 py-2 rounded-lg"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category name</FormLabel>
									<FormControl>
										<Input
											placeholder=""
											type="text"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<DialogClose className="mx-6">Cancel</DialogClose>
							<Button>{props.type}</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
