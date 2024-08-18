'use client';

import { Suspense, useState, useEffect, ReactNode } from 'react';

import { ContentSearchFilter } from '@/types/archive';

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

import { CardSpinner } from './card-spinner';
import {
	DragDropContext,
	Draggable,
	Droppable,
} from '@hello-pangea/dnd';

const testCategories: Category[] = [];
const testDocuments: Content[] = [];

export function DocumentCollection() {
	const [contentFilter, setContentFilter] = useState<ContentSearchFilter>({});
	const [isCreateForm, setIsCreateForm] = useState(false);
	const [isCategoryLoading, setIsCategoryLoading] = useState(true);
	const [isDocumentLoading, setIsDocumentLoading] = useState(true);
	const [categories, setCategories] = useState(testCategories);
	const [documents, setDocuments] = useState(testDocuments);
	const [currentPage, setCurrentPage] = useState(1);

	const pageSize = 50;

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
		if (!filter.category) {
			setIsCategoryLoading(true);
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
		} else {
			setCategories([]);
		}
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

			<div className="rounded-lg border bg-card text-card-foreground mt-2 mb-8 mr-4 md:mr-16">
				<div className="last:border-0 border-b grid grid-cols-[auto_2rem] sm:grid-cols-[auto_10rem_2rem] px-4 py-2">
					<h1>Content name</h1>
					<div className="hidden sm:flex">
						<h1>Update Date</h1>
					</div>
					<h1>Edit</h1>
				</div>
				<DragDropContext
					onDragEnd={(result, provided) => {
						const content = documents.find(
							(doc) => doc.id === result.draggableId
						);
						if (content && result.destination) {
							if (result.destination.droppableId === 'Home') {
								onRemoveContentCategory(content);
							} else {
								const category = categories.find(
									(category) =>
										category.id ===
										result.destination?.droppableId
								);
								if (category) {
									onMoveContentToCategory(content, category);
								}
							}
						}
					}}
				>
					<Suspense fallback={<CardSpinner />}>
						{contentFilter.category && (
							<Droppable droppableId="Home">
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className="last:border-0 border-b"
									>
										<CategoryCard
											key={'Home'}
											data={{
												id: '',
												name: 'All content',
												userId: '',
											}}
											onClick={() => {
												onFilterContent({});
											}}
										/>
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						)}
						{categories.map((category) => (
							<Droppable
								key={category.id}
								droppableId={category.id}
							>
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className="last:border-0 border-b"
									>
										<CategoryCard
											data={category}
											onClick={() => {
												const filter = {
													category: category.id,
												};
												onFilterContent(filter);
											}}
											editFunction={{
												onDelete: onDeleteCategory,
												onUpdate: onUpdateCategory,
											}}
											isSelected={
												category.id ==
												contentFilter.category
											}
										/>
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						))}
						<Droppable droppableId={'Content List'}>
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
								>
									{documents.map((doc, index) => (
										<Draggable
											key={doc.id}
											draggableId={doc.id}
											index={index}
										>
											{(provided) => (
												<div
													{...provided.dragHandleProps}
													{...provided.draggableProps}
													ref={provided.innerRef}
													className="last:border-0 border-b"
												>
													<DocumentCard
														data={doc}
														categories={categories}
														onDelete={
															onDeleteContent
														}
														onRename={
															onRenameContent
														}
														onDeleteCategory={
															onRemoveContentCategory
														}
														onMoveToCategory={
															onMoveContentToCategory
														}
													/>
												</div>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</div>
							)}
						</Droppable>

						{(isDocumentLoading || isCategoryLoading) && (
							<CardSpinner />
						)}
					</Suspense>
				</DragDropContext>
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
