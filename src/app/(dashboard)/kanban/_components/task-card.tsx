'use client';

import { RefAttributes, useState } from 'react';
import { Icons } from '@/components/global/icons';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Ellipsis, Trash2 } from 'lucide-react';
import { Category, Task } from '@/types/db';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskForm } from './task-form';
import { ConfirmDialog } from '@/components/global/confirm-dialog';

interface TaskCardProps {
	data: Task;
	taskFunction: {
		onDelete: (task: Task) => void;
		onUpdate: (task: Task) => void;
	};
}

const TaskCard = (props: TaskCardProps & RefAttributes<HTMLDivElement>) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDeleteDialog, setIsDeleteDialog] = useState(false);
	const [isUpdateForm, setIsUpdateForm] = useState(false);

	return (
		<>
			<div
				{...props}
				onClick={(e) => {
					e.stopPropagation();
					!isUpdateForm && setIsUpdateForm(true);
				}}
				className="rounded-lg border bg-card text-card-foreground shadow-sm py-2 px-4 min-w-60 max-w-80"
			>
				<div className="flex flex-row justify-between items-center">
					<h1 className="text-lg font-semibold leading-none tracking-tight">
						{props.data.name}
					</h1>
					<DropdownMenu onOpenChange={setIsDropdownOpen}>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								onClick={(e) => {
									e.stopPropagation();
								}}
							>
								<Ellipsis />
								<span className="sr-only">Edit Column</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								className="gap-2 text-destructive"
								onClick={(e) => {
									e.stopPropagation();
									setIsDeleteDialog(true);
								}}
							>
								<Icons.trash className="h-5 w-5" /> Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<TaskForm
				type={'Update'}
				task={props.data}
				open={isUpdateForm}
				onOpenChange={setIsUpdateForm}
				onSubmit={(values) => {
					props.taskFunction.onUpdate({
						id: props.data.id,
						boardId: props.data.boardId,
						columnId: props.data.columnId,
						name: values.name,
						index: props.data.index,
						description: values.description,
					});
					setIsUpdateForm(false);
				}}
			/>
			<ConfirmDialog
				title={`Delete task "${props.data.name}?"`}
				open={isDeleteDialog && !isDropdownOpen}
				onOpenChange={setIsDeleteDialog}
				onConfirm={() => {
					props.taskFunction.onDelete(props.data);
					setIsDeleteDialog(false);
				}}
			/>
		</>
	);
};

export default TaskCard;
