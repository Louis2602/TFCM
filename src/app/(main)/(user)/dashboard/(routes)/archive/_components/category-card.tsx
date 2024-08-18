'use client';

import { useState } from 'react';
import { Icons } from '@/components/global/icons';
import { CategoryForm } from './category-form';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Ellipsis, Folder, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/global/confirm-dialog';
import { Category } from '@/types/db';

interface CategoryCardProps {
	onClick: () => void;
	data: Category;
	isSelected?: boolean;
	editFunction?: {
		onDelete: (id: string) => void;
		onUpdate: (id: string, title: string) => void;
	};
}

const CategoryCard = (props: CategoryCardProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isDeleteDialog, setIsDeleteDialog] = useState(false);
	const [isUpdateForm, setIsUpdateForm] = useState(false);

	const f = props.editFunction;

	return (
		<div className="flex justify-center items-center h-12">
			<div className="grid grid-cols-[3rem_auto_2rem] sm:grid-cols-[3rem_auto_10rem_2rem] w-full px-4 py-2">
				<div
					className="flex flex-row items-center"
					onClick={props.onClick}
				>
					<Folder />
				</div>

				<div
					className="flex flex-col justify-center truncate hover:text-primary transition-colors cursor-pointer"
					onClick={props.onClick}
				>
					<h1 className="align-middle h-max">{props.data.name}</h1>
				</div>

				<div className="hidden sm:flex flex-col justify-center">
					<h1 className="align-middle h-max">
						{props.data.updatedAt?.toLocaleDateString()}
					</h1>
				</div>

				{f && (
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
								<span className="sr-only">Edit category</span>
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
								className="gap-2"
								onClick={() => {}}
							>
								<Icons.share className="h-5 w-5" /> Share
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
				)}
			</div>

			{f && (
				<>
					<CategoryForm
						open={isUpdateForm && !isDropdownOpen}
						onOpenChange={(open) => {
							setIsUpdateForm(open);
							setTimeout(() => {
								if (!open) {
									document.body.style.pointerEvents = '';
								}
							}, 100);
						}}
						type="Update"
						currentName={props.data.name}
						onSubmit={(values) => {
							f.onUpdate(props.data.id, values.name);
						}}
					/>
					<ConfirmDialog
						open={isDeleteDialog && !isDropdownOpen}
						onOpenChange={(open) => {
							setIsDeleteDialog(open);
							setTimeout(() => {
								if (!open) {
									document.body.style.pointerEvents = '';
								}
							}, 100);
						}}
						title={'Delete "' + props.data.name + '"?'}
						variant="destructive"
						confirmText="Delete"
						onConfirm={() => {
							f.onDelete(props.data.id);
						}}
					/>
				</>
			)}
		</div>
	);
};

export default CategoryCard;
