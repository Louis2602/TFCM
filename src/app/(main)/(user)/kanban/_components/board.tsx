'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { KanbanBoardData } from '@/types/kanban';
import { apiWrapper } from '@/lib/utils';

import { getBoard } from '@/lib/actions/kanban/board/read';
import { updateBoard } from '@/lib/actions/kanban/board/udpate';
import { deleteBoard } from '@/lib/actions/kanban/board/delete';

import { createColumn } from '@/lib/actions/kanban/column/create';
import { updateColumn } from '@/lib/actions/kanban/column/update';
import { deleteColumn } from '@/lib/actions/kanban/column/delete';

import { createTask } from '@/lib/actions/kanban/task/create';
import { updateTask } from '@/lib/actions/kanban/task/update';
import { deleteTask } from '@/lib/actions/kanban/task/delete';
import { KanbanColumn, Task } from '@/types/db';

import { Icons } from '@/components/global/icons';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import ColumnCard from './column-card';

import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { BoardForm } from './board-form';
import { ColumnForm } from './column-form';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { toast } from 'sonner';

export interface BoardProps {
	id: string;
}

const KanbanBoard = (props: BoardProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDeleteDialog, setIsDeleteDialog] = useState(false);
	const [isUpdateForm, setIsUpdateForm] = useState(false);
	const [isCreateForm, setIsCreateForm] = useState(false);
	const router = useRouter();

	const [board, setBoard] = useState<KanbanBoardData>({
		id: props.id,
		name: '',
		columns: [],
	});

	useEffect(() => {
		setIsLoading(true);
		apiWrapper(
			() => getBoard(props.id),
			(res) => {
				setBoard(
					res.board
						? res.board
						: { id: props.id, name: '', columns: [] }
				);
				setIsLoading(false);
			}
		);
	}, [props.id]);

	function reorder<T>(array: T[], source: number, destination: number) {
		const result = Array.from(array);
		const [moveElement] = result.splice(source, 1);
		result.splice(destination, 0, moveElement);
		return result;
	}

	const onUpdateBoard = (name: string) => {
		setBoard({ ...board, name: name });
		apiWrapper(
			() => updateBoard(props.id, name),
			(res) => {
				toast.success(
					`Board "${board.name}" has been change to "${name}"`
				);
			},
			() => setBoard({ ...board })
		);
	};
	const onDeleteBoard = () => {
		apiWrapper(
			() => deleteBoard(props.id),
			(res) => {
				toast.success(`Board "board.name" has been deleted`);
				router.push('/kanban');
			}
		);
	};

	const boardFunction = {
		onUpdate: onUpdateBoard,
		onDelete: onDeleteBoard,
	};

	const onCreateColumn = (name: string) => {
		apiWrapper(
			() => createColumn(props.id, name, board.columns.length),
			(res) => {
				if (res.newColumn) {
					board.columns.push({ ...res.newColumn, tasks: [] });
				}
				toast.success('Column "' + name + '" has been created');
				setBoard({ ...board });
			}
		);
	};
	const onUpdateColumn = (column: KanbanColumn, prevIndex?: number) => {
		const prevName = board.columns.find(
			(col) => col.id === column.id
		)?.name;
		apiWrapper(
			() => updateColumn(column, prevIndex),
			() => {
				toast.success(
					`Column "${prevName}" has been change to "${column.name}"`
				);
			},
			() => setBoard({ ...board })
		);
		board.columns = board.columns.map((col) => {
			if (col.id === column.id) {
				col.name = column.name;
			}
			return col;
		});
		if (prevIndex) {
			board.columns = reorder(board.columns, prevIndex, column.index);
		}
		setBoard({ ...board });
	};
	const onDeleteColumn = (id: string) => {
		const col = board.columns.find((col) => col.id === id);

		apiWrapper(
			() => deleteColumn(id),
			() => {
				toast.success('Column "' + col?.name + '" has been deleted');
			},
			() => setBoard({ ...board })
		);

		board.columns = board.columns.filter((col) => {
			return col.id !== id;
		});
		setBoard({ ...board });
	};

	const columnFunction = {
		onCreate: onCreateColumn,
		onUpdate: onUpdateColumn,
		onDelete: onDeleteColumn,
	};

	const onCreateTask = (task: Task) => {
		apiWrapper(
			() => createTask(task),
			(res) => {
				if (res.newTask) {
					const colIdx = board.columns.findIndex(
						(col) => col.id === task.columnId
					);

					if (colIdx === -1) {
						return;
					}

					board.columns[colIdx].tasks.push(res.newTask);
					setBoard({ ...board });
					toast.success('Task "' + task.name + '" has been created');
				}
			}
		);
	};
	const onUpdateTask = (task: Task, prevColumnId?: string) => {
		apiWrapper(
			() => updateTask(task),
			(res) => {
				toast.success('Task "' + task.name + '" has been updated');
			},
			() => setBoard({ ...board })
		);

		let colIdx = -1;
		if (prevColumnId) {
			colIdx = board.columns.findIndex((col) => col.id === prevColumnId);
		} else {
			colIdx = board.columns.findIndex((col) => col.id === task.columnId);
		}

		if (colIdx === -1) {
			return;
		}

		const prevTask = board.columns[colIdx].tasks.findIndex(
			(t) => t.id === task.id
		);
		const nextColumnIdx = prevColumnId
			? board.columns.findIndex((col) => col.id === task.columnId)
			: colIdx;

		const newIndex =
			task.index !== undefined && task.index !== null
				? task.index
				: prevTask;
		board.columns[colIdx].tasks.splice(prevTask, 1);
		board.columns[nextColumnIdx].tasks.splice(newIndex, 0, task);

		setBoard({ ...board });
	};
	const onDeleteTask = (task: Task) => {
		apiWrapper(
			() => deleteTask(task.id),
			(res) => {
				toast.success('Task "' + task.name + '" has been deleted');
			},
			() => setBoard({ ...board })
		);

		const colIdx = board.columns.findIndex(
			(col) => col.id === task.columnId
		);
		if (colIdx === -1) {
			return;
		}
		board.columns[colIdx].tasks = board.columns[colIdx].tasks.filter(
			(t) => t.id !== task.id
		);
		setBoard({ ...board });
	};
	const taskFunction = {
		onCreate: onCreateTask,
		onUpdate: onUpdateTask,
		onDelete: onDeleteTask,
	};

	return isLoading ? (
		<Icons.spinner
			className="mr-2 h-4 w-4 animate-spin"
			aria-hidden="true"
		/>
	) : (
		<div className="mt-16">
			<div className="flex flex-row gap-4 my-8">
				<h1 className="font-heading text-2xl">{board.name}</h1>
				<Icons.edit
					className="cursor-pointer"
					onClick={() => setIsUpdateForm(true)}
				/>
				<Icons.trash
					className="text-destructive cursor-pointer"
					onClick={() => setIsDeleteDialog(true)}
				/>
			</div>

			<DragDropContext
				onDragEnd={(result, provided) => {
					const { destination, source, draggableId, type } = result;

					if (
						source.droppableId === destination?.droppableId &&
						source.index === destination.index
					) {
						return;
					}

					if (type === 'card' && destination) {
						const prevColumn = board.columns.find(
							(col) => col.id === source.droppableId
						);
						const nextColumn = board.columns.find(
							(col) => col.id === destination.droppableId
						);
						const task = prevColumn?.tasks.find(
							(t) => t.id === draggableId
						);

						if (prevColumn && nextColumn && task) {
							taskFunction.onUpdate(
								{
									...task,
									index: destination.index,
									columnId: destination.droppableId,
								},
								source.droppableId
							);
						}
					}

					if (type === 'list' && destination) {
						const column = board.columns.find(
							(col) => col.id === draggableId
						);
						if (column) {
							columnFunction.onUpdate(
								{
									...column,
									boardId: props.id,
									index: destination.index,
								},
								source.index
							);
						}
					}
				}}
			>
				<div className="flex flex-row gap-8">
					<Droppable
						droppableId={props.id}
						type="list"
						direction="horizontal"
					>
						{(provided) => (
							<div
								{...provided.droppableProps}
								ref={provided.innerRef}
								className="flex flex-row gap-8"
							>
								{board.columns.map((col, index) => (
									<Draggable
										draggableId={col.id}
										index={index}
										key={col.id}
									>
										{(provided) => (
											<ColumnCard
												{...provided.dragHandleProps}
												{...provided.draggableProps}
												innerRef={provided.innerRef}
												index={col.index}
												key={col.id}
												boardId={props.id}
												data={col}
												taskFunction={taskFunction}
												columnFunction={columnFunction}
											/>
										)}
									</Draggable>
								))}
							</div>
						)}
					</Droppable>
					<div
						className="rounded-lg border bg-card text-card-foreground shadow-sm hover:border-primary p-2 min-w-60 max-w-80 max-h-16"
						onClick={() => setIsCreateForm(true)}
					>
						<div className="flex flex-row justify-center items-center w-[100%] h-[100%]">
							<h1 className="text-lg font-semibold leading-none tracking-tight">
								+ Add
							</h1>
						</div>
					</div>
				</div>
			</DragDropContext>

			<BoardForm
				type={'Update'}
				open={isUpdateForm}
				onOpenChange={setIsUpdateForm}
				onSubmit={(values) => {
					boardFunction.onUpdate(values.name);
					setIsUpdateForm(false);
				}}
			/>
			<ColumnForm
				type={'Create'}
				open={isCreateForm && !isDropdownOpen}
				onOpenChange={setIsCreateForm}
				onSubmit={(values) => {
					columnFunction.onCreate(values.name);
					setIsCreateForm(false);
				}}
			/>
			<ConfirmDialog
				title={'Delete Board'}
				open={isDeleteDialog && !isDropdownOpen}
				onOpenChange={setIsDeleteDialog}
				onConfirm={() => {
					boardFunction.onDelete();
				}}
			/>
		</div>
	);
};

export default KanbanBoard;
