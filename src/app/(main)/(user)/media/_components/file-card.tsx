'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

import type { Folder, File } from '@/types/db';

import ShareButton from './share-button';
import Link from 'next/link';

import { FileMoveDialog } from './file-move-dialog';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { RenameFileForm } from './rename-form';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from '@/components/ui/dropdown-menu';


import { Ellipsis, File as FileIcon, Share2 } from 'lucide-react';
import { Icons } from '@/components/global/icons';

interface FileCardProps {
	onDelete: (id: string) => void;
	onRename: (id: string, name: string) => void;
	onMoveToFolder: (file: File, folder: Folder) => void;
	onDeleteFolder: (file: File) => void;
	data: File;
	folders: Folder[];
}

const FileCard = (props: FileCardProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [moveDropdown, setMoveDropdown] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState(false);
	const [renameDialog, setRenameDialog] = useState(false);
	const [shareDialog, setShareDialog] = useState(false);

	const data = props.data;

	return (
		<div className="last:border-0 border-b grid grid-cols-[3rem_auto_2rem] sm:grid-cols-[3rem_auto_10rem_2rem] px-4 py-2">
			<div className="flex flex-col justify-center">
				<FileIcon />
			</div>

			<div className="flex flex-col justify-center truncate hover:text-primary transition-colors">
				<Link href={`/media/${data.id}`}>{data.name}</Link>
			</div>

			<div className="hidden sm:flex flex-col justify-center">
				<h1 className="align-middle h-max">
					{props.data.updatedAt?.toLocaleDateString()}
				</h1>
			</div>

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
						<span className="sr-only">Edit file</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						className="gap-2"
						onClick={() => {
							setMoveDropdown(true);
						}}
					>
						<Icons.arrowWideNarrow className="h-5 w-5" /> Move
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2"
						onClick={() => {
							setRenameDialog(true);
						}}
					>
						<Icons.edit className="h-5 w-5" /> Rename
					</DropdownMenuItem>
					<DropdownMenuItem
						className="gap-2"
						onClick={() => {
							setShareDialog(true);
						}}
					>
						<Share2 className="h-5 w-5" /> Share
					</DropdownMenuItem>

					<DropdownMenuItem
						className="gap-2 text-destructive"
						onClick={() => {
							setDeleteDialog(true);
						}}
					>
						<Icons.trash className="h-5 w-5" /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<RenameFileForm
				currentName={props.data.name}
				open={renameDialog && !isDropdownOpen}
				onOpenChange={setRenameDialog}
				onSubmit={(values) => {
					props.onRename(props.data.id, values.name);
				}}
			/>
			<FileMoveDialog
				file={props.data}
				folders={props.folders}
				open={moveDropdown && !isDropdownOpen}
				onOpenChange={setMoveDropdown}
				onMoveToFolder={props.onMoveToFolder}
				onDeleteFolder={props.onDeleteFolder}
			/>
			<ConfirmDialog
				title="Delete File?"
				open={deleteDialog && !isDropdownOpen}
				onOpenChange={setDeleteDialog}
				onConfirm={() => props.onDelete(props.data.id)}
			/>
		</div>
	);
};

export default FileCard;

FileCard.Skeleton = function DocumentCardSkeleton() {
	return (
		<div className="aspect-[600/400] rounded-lg overflow-hidden">
			<Skeleton className="h-full w-full" />
		</div>
	);
};
