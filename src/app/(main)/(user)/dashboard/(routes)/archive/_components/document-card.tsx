'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

import type { Category, Content } from '@/types/db';

import ShareButton from './share-button';
import Link from 'next/link';

import { DocumentMoveDialog } from './document-move-dialog';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { RenameContentForm } from './rename-form';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

import { Icons } from '@/components/global/icons';
import { Ellipsis, File, Share2 } from 'lucide-react';

interface DocumentCardProps {
	onDelete: (id: string) => void;
	onRename: (id: string, name: string) => void;
	onMoveToCategory: (content: Content, category: Category) => void;
	onDeleteCategory: (content: Content) => void;
	data: Content;
	categories: Category[];
}

const DocumentCard = (props: DocumentCardProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [moveDropdown, setMoveDropdown] = useState(false);
	const [deleteDialog, setDeleteDialog] = useState(false);
	const [renameDialog, setRenameDialog] = useState(false);
	const [shareDialog, setShareDialog] = useState(false);

	const data = props.data;

	return (
		<div className="last:border-0 border-b grid grid-cols-[3rem_auto_2rem] sm:grid-cols-[3rem_auto_10rem_2rem] px-4 py-2">
			<div className="flex flex-col justify-center">
				<File />
			</div>

			<div className="flex flex-col justify-center truncate hover:text-primary transition-colors">
				<Link href={`/dashboard/archive/${data.id}`}>{data.title}</Link>
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
						<span className="sr-only">Edit content</span>
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

			<RenameContentForm
				currentName={props.data.title}
				open={renameDialog && !isDropdownOpen}
				onOpenChange={setRenameDialog}
				onSubmit={(values) => {
					props.onRename(props.data.id, values.name);
				}}
			/>
			<DocumentMoveDialog
				document={props.data}
				categories={props.categories}
				open={moveDropdown && !isDropdownOpen}
				onOpenChange={setMoveDropdown}
				onMoveToCategory={props.onMoveToCategory}
				onDeleteCategory={props.onDeleteCategory}
			/>
			<ConfirmDialog
				title={''}
				open={deleteDialog && !isDropdownOpen}
				onOpenChange={setDeleteDialog}
				onConfirm={() => props.onDelete(props.data.id)}
			/>
			<ShareButton
				open={shareDialog && !isDropdownOpen}
				onOpenChange={setShareDialog}
				contentId={data.id}
			/>
		</div>
	);
};

export default DocumentCard;

DocumentCard.Skeleton = function DocumentCardSkeleton() {
	return (
		<div className="aspect-[600/400] rounded-lg overflow-hidden">
			<Skeleton className="h-full w-full" />
		</div>
	);
};
