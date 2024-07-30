'use client';

import KanbanBoard, { BoardProps } from '../_components/board';

export default function TaskPage({ params }: { params: { id: string } }) {
	return (
		<>
			<div className="mb-6">
				<h2 className="font-heading text-3xl">Task Board</h2>
				<p className="text-muted-foreground">
					Managing your media for content creation.
				</p>
				<KanbanBoard id={params.id} />
			</div>
		</>
	);
}
