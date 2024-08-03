'use client';

import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Task } from '@/types/db';
import { TaskSchema } from '@/lib/validations/kanban';

import { useForm } from 'react-hook-form';

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

type FormData = z.infer<typeof TaskSchema>;

export type TaskFormProps = {
	task?: Task;
	type: 'Create' | 'Update';
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (values: FormData) => void;
};

export const TaskForm = (props: TaskFormProps) => {
	const form = useForm<FormData>({
		resolver: zodResolver(TaskSchema),
		defaultValues: {
			name: props.task?.name,
			description: props.task?.description,
		},
	});

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{props.type === 'Create' && 'Create task'}
						{props.type === 'Update' && props.task
							? props.task?.name
							: 'Update task'}
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
									<FormLabel>Task name</FormLabel>
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
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input
											placeholder=""
											type="text"
											{...field}
											value={
												field.value
													? field.value
													: undefined
											}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<DialogClose className="sm:mx-6 mt-2 sm:mt-0 px-4 py-2">
								Cancel
							</DialogClose>
							<Button>{props.type}</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
