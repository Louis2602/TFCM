import { Task, KanbanColumn } from './db';

export type KanbanColumnData = {
	id: string;
	name: string;
	index: number;
	tasks: Task[];
};

export type KanbanBoardData = {
	id: string;
	name: string;
	columns: KanbanColumnData[];
};
