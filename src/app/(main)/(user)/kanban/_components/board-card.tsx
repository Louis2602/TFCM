'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface BoardCardProps {
	id: string;
	name: string;
	isAddCard?: boolean;
	onClick?: React.MouseEventHandler | undefined;
}

const BoardCard = (props: BoardCardProps) => {
	return (
		<Card
			className="hover:bg-secondary/20 cursor-pointer"
			onClick={props.onClick}
		>
			<CardHeader>
				<CardTitle>
					{props.isAddCard ? '+ Add Board' : props.name}
				</CardTitle>
			</CardHeader>
		</Card>
	);
};

export default BoardCard;
