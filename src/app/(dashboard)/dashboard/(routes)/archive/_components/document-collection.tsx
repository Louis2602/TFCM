'use client';

import { Suspense, useState, useEffect } from 'react';

import { ContentSearchFilter } from '@/types/archive';

import { Icons } from '@/components/global/icons';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import CategoryCard from './category-card';
import DocumentCard from './document-card';
import { CategoryForm } from './category-form';

import { createCategory } from '@/lib/actions/archive/category/create';
import { getCategory } from '@/lib/actions/archive/category/read';
import { updateCategory } from '@/lib/actions/archive/category/update';
import { removeCategory } from '@/lib/actions/archive/category/delete';

import {
	moveContentToCategory,
	removeContentCategory,
} from '@/lib/actions/archive/content/move';
import { getContent } from '@/lib/actions/archive/content/read';
import { renameContent } from '@/lib/actions/archive/content/rename';
import { deleteContent } from '@/lib/actions/archive/content/delete';
import { Content, Category } from '@/types/db';

const testCategories: Category[] = [];
const testDocuments: Content[] = [];

export function DocumentCollection() {
	const [contentFilter, setContentFilter] = useState<ContentSearchFilter>({});
	const [isCreateForm, setIsCreateForm] = useState(false);
	const [isCategoryLoading, setIsCategoryLoading] = useState(true);
	const [isDocumentLoading, setIsDocumentLoading] = useState(true);
	const [categories, setCategories] = useState(testCategories);
	const [documents, setDocuments] = useState(testDocuments);

	const currentCategoryFilter = categories.find(
		(category) => category.id === contentFilter.category
	);

	const pageSize = 50;
	const currentPage = 1;

	const contentOffset = pageSize * (currentPage - 1);

	const onPageLoaded = () => {
		getCategory()
			.then((res) => {
				if (res.success && res.categories) {
					setCategories(res.categories);
					setIsCategoryLoading(false);
				} else {
					toast.error('Unable to load categories: ' + res.error);
					setIsCategoryLoading(false);
				}
			})
			.catch((err) => {
				toast.error('Unable to load categories: ' + err);
			});

		getContent(contentOffset, pageSize)
			.then((res) => {
				if (res.success && res.contents) {
					setDocuments(res.contents);
				} else {
					toast.error('Unable to load documents: ' + res.error);
				}
				setIsDocumentLoading(false);
			})
			.catch((err) => {
				toast.error('Unable to load documents: ' + err);
				setIsDocumentLoading(false);
			});
	};

	const onFilterContent = (filter: ContentSearchFilter) => {
		setContentFilter(filter);
		setDocuments([]);
		setIsDocumentLoading(true);
		getContent(contentOffset, pageSize, filter)
			.then((res) => {
				if (res.success && res.contents) {
					setDocuments(res.contents);
				} else {
					toast.error('Unable to load documents: ' + res.error);
				}
				setIsDocumentLoading(false);
			})
			.catch((err) => {
				toast.error('Unable to load documents: ' + err);
				setIsDocumentLoading(false);
			});
	};

	const onDeleteContent = (id: string) => {
		deleteContent(id)
			.then((res) => {
				if (res.success) {
					const nextDocuments = documents.filter(
						(document) => document.id !== id
					);

					setDocuments(nextDocuments);
					toast.success('Content has been deleted.');
				} else {
					toast.error('Unable to delete content: ' + res.error);
				}
			})
			.catch((err) => {
				toast.error('Unable to delete content: ' + err);
			});
	};

	const onRenameContent = (id: string, name: string) => {
		renameContent(id, name)
			.then((res) => {
				if (res.success) {
					const nextDocuments = documents.map((document) => {
						if (document.id === id) {
							document.title = name;
						}
						return document;
					});

					setDocuments(nextDocuments);
					toast.success('Content has been renamed.');
				} else {
					toast.error('Unable to rename content: ' + res.error);
				}
			})
			.catch((err) => {
				toast.error('Unable to rename content: ' + err);
			});
	};

	const onCreateCategory = (name: string) => {
		createCategory(name)
			.then((res) => {
				if (res.success && res.newCategory) {
					const nextCategories = [...categories, res.newCategory];
					setCategories(nextCategories);
					toast.success('Category has been created!');
				} else {
					toast.error('Unable to create category: ' + res.error);
				}
			})
			.catch((err) => {
				toast.error('Unable to create category: ' + err);
			});
	};

	const onDeleteCategory = (id: string) => {
		removeCategory(id)
			.then((res) => {
				if (res.success) {
					const nextCategories = categories.filter(
						(category) => category.id !== id
					);

					setCategories(nextCategories);
					toast.success('Category has been deleted.');
				} else {
					toast.error('Unable to delete category: ' + res.error);
				}
			})
			.catch((err) => {
				toast.error('Unable to delete category: ' + err);
			});
	};

	const onUpdateCategory = (id: string, name: string) => {
		updateCategory(id, name)
			.then((res) => {
				if (res.success) {
					const nextCategories = [...categories];
					categories.map((category) => {
						if (category.id === id) {
							category.name = name;
						}
						return category;
					});
					setCategories(nextCategories);
					toast.success('Category has been changed!');
				} else {
					toast.error('Unable to update category: ' + res.error);
				}
			})
			.catch((err) => {
				toast.error('Unable to update category: ' + err);
			});
	};

	const onMoveContentToCategory = (content: Content, category: Category) => {
		moveContentToCategory(content.id, category.id)
			.then((res) => {
				if (res.success) {
					toast.success(
						content.title + ' has been moved to ' + category.name
					);
				} else {
					toast.error(
						'Unable to move content to category: ' + res.error
					);
				}
			})
			.catch((err) => {
				toast.error('Unable to move content to category: ' + err);
			});
	};

	const onRemoveContentCategory = (content: Content) => {
		removeContentCategory(content.id)
			.then((res) => {
				if (res.success) {
					toast.success(content.title + ' has been move to Home.');
				} else {
					toast.error(
						'Unable to remove content from category: ' + res.error
					);
				}
			})
			.catch((err) => {
				toast.error('Unable to update category: ' + err);
			});
	};

	useEffect(onPageLoaded, [contentOffset]);

	return (
		<div>
			<div className="mb-8 pb-4 border-b border-border/50">
				<h2 className="font-heading text-3xl">All written contents</h2>
				<p className="text-muted-foreground">
					Manage your content creation.
				</p>
			</div>

			<div className="flex items-center gap-12 mb-4">
				<h2 className="font-heading text-2xl">Categories</h2>
				<Button
					onClick={() => {
						setIsCreateForm(true);
					}}
					variant="default"
					size="sm"
				>
					Add Category
				</Button>
			</div>

			<div className="mt-2 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Suspense
					fallback={
						<Icons.spinner
							className="mr-2 h-4 w-4 animate-spin"
							aria-hidden="true"
						/>
					}
				>
					{currentCategoryFilter && (
						<CategoryCard
							key={'Home'}
							data={{ id: '', name: 'All content', userId: '' }}
							onClick={() => {
								onFilterContent({});
							}}
						/>
					)}
					{categories.map((category) => (
						<CategoryCard
							key={category.id}
							data={category}
							onClick={() => {
								const filter = { category: category.id };
								onFilterContent(filter);
							}}
							editFunction={{
								onDelete: onDeleteCategory,
								onUpdate: onUpdateCategory,
							}}
							isSelected={category.id == contentFilter.category}
						/>
					))}
					{isCategoryLoading && (
						<Icons.spinner
							className="mr-2 h-4 w-4 animate-spin"
							aria-hidden="true"
						/>
					)}
				</Suspense>
			</div>

			<h2 className="font-heading text-2xl">
				{currentCategoryFilter && currentCategoryFilter.name + ' > '}
				Contents
			</h2>
			<div className="mt-2 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Suspense
					fallback={
						<Icons.spinner
							className="mr-2 h-4 w-4 animate-spin"
							aria-hidden="true"
						/>
					}
				>
					{documents.map((doc) => (
						<DocumentCard
							key={doc.id}
							data={doc}
							categories={categories}
							onDelete={onDeleteContent}
							onRename={onRenameContent}
							onDeleteCategory={onRemoveContentCategory}
							onMoveToCategory={onMoveContentToCategory}
						/>
					))}
					{isDocumentLoading && (
						<Icons.spinner
							className="mr-2 h-4 w-4 animate-spin"
							aria-hidden="true"
						/>
					)}
				</Suspense>
			</div>

			<CategoryForm
				open={isCreateForm}
				onOpenChange={setIsCreateForm}
				type="Create"
				onSubmit={(values) => {
					onCreateCategory(values.name);
				}}
			/>
		</div>
	);
}
