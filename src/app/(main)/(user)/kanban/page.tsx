'use client';

import type { Metadata } from 'next';
import { useEffect, useState } from 'react';
import { getBoards } from '@/lib/actions/kanban/read';
import { apiWrapper } from '@/lib/utils';
import { createBoard } from '@/lib/actions/kanban/board/create';
import { BoardForm } from './_components/board-form';
import BoardCard, { BoardCardProps } from './_components/board-card';
import { toast } from 'sonner';
import Link from 'next/link';
import { Icons } from '@/components/global/icons';

export default function TaskPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [isCreateForm, setIsCreateForm] = useState(false);
	const [kanbanBoards, setKanbanBoards] = useState<BoardCardProps[]>([]);

	useEffect(() => {
		setIsLoading(true)
		apiWrapper(getBoards, (res) => {
			if (res.boards) setKanbanBoards(res.boards);
			setIsLoading(false);
		});
	}, []);

	const onCreateBoard = (name: string) => {
		apiWrapper(
			() => createBoard(name),
			(res) => {
				if (res.newBoard) kanbanBoards.push(res.newBoard);
				setKanbanBoards([...kanbanBoards]);
				toast.success('Board "' + name + '" has been created');
			}
		);
	};

	return (
		<>
			<div className="mb-6">
				<h2 className="font-heading text-3xl">Task Board</h2>
				<p className="text-muted-foreground">
					Managing your media for content creation.
				</p>

				{isLoading ? (
					<Icons.spinner
						className="mr-2 h-4 w-4 animate-spin"
						aria-hidden="true"
					/>
				) : (
					<div className="my-8 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 gap-4">
						{kanbanBoards.map((board) => (
							<Link key={board.id} href={'kanban/' + board.id}>
								<BoardCard key={board.id} {...board} />
							</Link>
						))}
						<BoardCard
							id=""
							name=""
							isAddCard={true}
							onClick={() => setIsCreateForm(true)}
						/>
					</div>
				)}
			</div>

			<BoardForm
				type={'Create'}
				open={isCreateForm}
				onOpenChange={setIsCreateForm}
				onSubmit={(values) => onCreateBoard(values.name)}
			/>
		</>
	);
}
