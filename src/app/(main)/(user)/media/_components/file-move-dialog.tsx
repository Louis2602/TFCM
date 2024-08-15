'use client';

import { Button } from '@/components/ui/button';

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
	DialogFooter,
} from '@/components/ui/dialog';

import { File, Folder } from '@/types/db';

export type MoveFileProps = {
	file: File;
	folders: Folder[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onMoveToFolder: (content: File, folder: Folder) => void;
	onDeleteFolder: (content: File) => void;
};

export const FileMoveDialog = (props: MoveFileProps) => {
	let selected: Folder | undefined = undefined;

	const onSelect = (value: string) => {
		selected = props.folders.find((folder) => folder.id === value);
	};

	const onChange = () => {
		if (selected) {
			props.onMoveToFolder(props.file, selected);
		} else {
			props.onDeleteFolder(props.file);
		}
	};

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle className="py-5">
						{'Move "' + props.file.name + '" to:'}
					</DialogTitle>
					<Select onValueChange={onSelect}>
						<SelectTrigger>
							<SelectValue placeholder="Select folder to move to" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem key={'/'} value={'Home'}>
								Home
							</SelectItem>
							{props.folders.map((folder) => (
								<SelectItem
									key={folder.id}
									value={folder.id}
								>
									{folder.name}
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
