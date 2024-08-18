'use client';

import { HTMLAttributes, RefAttributes, useState } from 'react';

import { Icons } from '@/components/global/icons';
import { Ellipsis, Trash2 } from 'lucide-react';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button, IconButton } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { KanbanColumn, Task } from '@/types/db';
import { KanbanColumnData } from '@/types/kanban';

import TaskCard from './task-card';
import { ColumnForm } from './column-form';
import { TaskForm } from './task-form';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface ColumnCardProps {
	boardId: string;
	index: number;
	data: KanbanColumnData;
	innerRef?: (a?: HTMLElement | null) => void;
	taskFunction: {
		onCreate: (task: Task) => void;
		onDelete: (task: Task) => void;
		onUpdate: (task: Task) => void;
	};
	columnFunction: {
		onDelete: (id: string) => void;
		onUpdate: (column: KanbanColumn) => void;
	};
}

const ColumnCard = (props: ColumnCardProps & RefAttributes<HTMLDivElement>) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDeleteDialog, setIsDeleteDialog] = useState(false);
	const [isUpdateForm, setIsUpdateForm] = useState(false);
	const [isCreateForm, setIsCreateForm] = useState(false);

	return (
		<div
			{...props}
			ref={props.innerRef}
			className="rounded-lg border bg-card text-card-foreground shadow-sm pb-2 px-4 min-w-60 max-w-80"
		>
			<div className="flex flex-row justify-between items-center m-4 my-8">
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
							className="gap-2"
							onClick={(e) => {
								e.stopPropagation();
								setIsUpdateForm(true);
							}}
						>
							<Icons.edit className="h-5 w-5" /> Update
						</DropdownMenuItem>
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
			<Droppable
				key={props.data.id}
				droppableId={props.data.id}
				type="card"
				direction="vertical"
			>
				{(provided) => (
					<div
						className="flex flex-col justify-between items-center gap-2 p-2"
						{...provided.droppableProps}
						ref={provided.innerRef}
					>
						{props.data.tasks.map((task, index) => (
							<Draggable
								draggableId={task.id}
								index={index}
								key={task.id}
							>
								{(provided) => (
									<div
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
									>
										<TaskCard
											data={task}
											taskFunction={props.taskFunction}
										/>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
						<div
							className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 min-w-60 max-w-80"
							onClick={() => setIsCreateForm(true)}
						>
							<h1 className="text-lg font-semibold leading-none tracking-tight">
								+ Add
							</h1>
						</div>
					</div>
				)}
			</Droppable>

			<TaskForm
				type={'Create'}
				open={isCreateForm}
				onOpenChange={setIsCreateForm}
				onSubmit={(values) => {
					props.taskFunction.onCreate({
						id: '',
						boardId: props.boardId,
						columnId: props.data.id,
						index: props.data.tasks.length,
						name: values.name,
						description: values.description,
					});
					setIsCreateForm(false);
				}}
			/>
			<ColumnForm
				type={'Update'}
				name={props.data.name}
				open={isUpdateForm && !isDropdownOpen}
				onOpenChange={setIsUpdateForm}
				onSubmit={(values) => {
					props.columnFunction.onUpdate({
						id: props.data.id,
						boardId: props.boardId,
						name: values.name,
						index: props.index,
					});
					setIsUpdateForm(false);
				}}
			/>
			<ConfirmDialog
				title={`Delete column "${props.data.name}"?`}
				open={isDeleteDialog && !isDropdownOpen}
				onOpenChange={setIsDeleteDialog}
				onConfirm={() => {
					props.columnFunction.onDelete(props.data.id);
					setIsDeleteDialog(false);
				}}
			/>
		</div>
	);
};

export default ColumnCard;
