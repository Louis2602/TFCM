'use client';

import { Button, IconButton } from '@/components/ui/button';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogClose,
	DialogTrigger,
	DialogFooter,
} from '@/components/ui/dialog';

import { Icons } from '@/components/global/icons';
import { Category, Content } from '@/types/db';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

export type MoveDocumentProps = {
	document: Content;
	categories: Category[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onMoveToCategory: (content: Content, category: Category) => void;
	onDeleteCategory: (content: Content) => void;
};

export const DocumentMoveDialog = (props: MoveDocumentProps) => {
	let selected: Category | undefined = undefined;

	const onSelect = (value: string) => {
		selected = props.categories.find((category) => category.id === value);
	};

	const onChange = () => {
		if (selected) {
			props.onMoveToCategory(props.document, selected);
		} else {
			props.onDeleteCategory(props.document);
		}
	};

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle className="py-5">
						{'Move "' + props.document.title + '" to:'}
					</DialogTitle>
					<Select onValueChange={onSelect}>
						<SelectTrigger>
							<SelectValue placeholder="Select category to move to" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem key={'/'} value={'Home'}>
								Home
							</SelectItem>
							{props.categories.map((category) => (
								<SelectItem
									key={category.id}
									value={category.id}
								>
									{category.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</DialogHeader>
				<DialogFooter>
					<DialogClose className='mx-6'>
						Cancel
					</DialogClose>
					<Button onClick={onChange}>
						Move
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
