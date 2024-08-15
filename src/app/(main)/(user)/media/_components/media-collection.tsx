'use client';

import { Suspense, useState, useEffect, ReactNode } from 'react';

import { FileSearchFilter } from '@/types/media';

import { Icons } from '@/components/global/icons';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

import FolderCard from './folder-card';
import FileCard from './file-card';
import { FolderForm } from './folder-form';

import { createFolder } from '@/lib/actions/media/folder/create';
import { getFolder } from '@/lib/actions/media/folder/read';
import { updateFolder } from '@/lib/actions/media/folder/update';
import { removeFolder } from '@/lib/actions/media/folder/delete';

import { getFiles } from '@/lib/actions/media/file/read';
import { renameFile } from '@/lib/actions/media/file/rename';
import {
	moveFileToFolder,
	removeFileFromFolder,
} from '@/lib/actions/media/file/move';
import { deleteFile } from '@/lib/actions/media/file/delete';

import { File, Folder } from '@/types/db';
import { CardSpinner } from './card-spinner';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { apiWrapper } from '@/lib/utils';
import { UploadButton } from './upload';

const testFolders: Folder[] = [];
const testFiles: File[] = [];

export const MediaCollection = () => {
	const [fileFilter, setFileFilter] = useState<FileSearchFilter>({});
	const [isCreateForm, setIsCreateForm] = useState(false);
	const [isFolderLoading, setIsFolderLoading] = useState(true);
	const [isFileLoading, setIsFileLoading] = useState(true);
	const [folders, setFolders] = useState(testFolders);
	const [files, setFiles] = useState(testFiles);
	const [currentPage, setCurrentPage] = useState(1);

	const pageSize = 50;

	const FileOffset = pageSize * (currentPage - 1);

	const onPageLoaded = () => {
		apiWrapper(
			getFolder,
			(res) => {
				if (res.success && res.folders) {
					setFolders(res.folders);
				}
				setIsFolderLoading(false);
			},
			() => setIsFolderLoading(false),
			'Unable to load folders'
		);

		apiWrapper(
			() => getFiles(FileOffset, pageSize),
			(res) => {
				if (res.success && res.files) {
					setFiles(res.files);
				}
				setIsFileLoading(false);
			},
			() => setIsFileLoading(false),
			'Unable to load files'
		);
	};

	const onFilterFile = (filter: FileSearchFilter) => {
		setFileFilter(filter);
		setFiles([]);
		if (!filter.folder) {
			setIsFolderLoading(true);
			apiWrapper(
				getFolder,
				(res) => {
					if (res.success && res.folders) {
						setFolders(res.folders);
					}
					setIsFolderLoading(false);
				},
				() => setIsFolderLoading(false),
				'Unable to load folders'
			);
		} else {
			setFolders([]);
		}

		setIsFileLoading(true);
		apiWrapper(
			() => getFiles(FileOffset, pageSize),
			(res) => {
				if (res.success && res.files) {
					setFiles(res.files);
				}
				setIsFolderLoading(false);
			},
			() => setIsFileLoading(false),
			'Unable to load files'
		);
	};

	const onUploadFile = (file: File) => {
		file.createdAt = file.createdAt ? new Date(file.createdAt) : undefined;
		file.updatedAt = file.updatedAt ? new Date(file.updatedAt) : undefined;
		files.push(file);
		setFiles([...files]);
	};

	const onDeleteFile = (id: string) => {
		apiWrapper(
			() => deleteFile(id),
			(res) => {
				if (res.success) {
					const nextFiles = files.filter((file) => file.id !== id);
					setFiles(nextFiles);
					toast.success('File has been deleted.');
				}
			},
			undefined,
			'Unable to delete file'
		);
	};

	const onRenameFile = (id: string, name: string) => {
		apiWrapper(
			() => renameFile(id, name),
			(res) => {
				if (res.success) {
					const nextFiles = files.map((file) => {
						if (file.id === id) {
							file.name = name;
						}
						return file;
					});

					setFiles(nextFiles);
					toast.success('File has been renamed.');
				}
			},
			undefined,
			'Unable to rename file'
		);
	};

	const onCreateFolder = (name: string) => {
		apiWrapper(
			() => createFolder(name),
			(res) => {
				if (res.success && res.newFolder) {
					const nextFolders = [...folders, res.newFolder];
					setFolders(nextFolders);
					toast.success('Folder has been created!');
				} else {
					toast.error('Unable to create folder: ' + res.error);
				}
			},
			undefined,
			'Unable to create folder'
		);
	};

	const onDeleteFolder = (id: string) => {
		apiWrapper(
			() => removeFolder(id),
			(res) => {
				if (res.success) {
					const nextCategories = folders.filter(
						(folder) => folder.id !== id
					);

					setFolders(nextCategories);
					toast.success('Folder has been deleted.');
				}
			},
			undefined,
			'Unable to delete folder'
		);
	};

	const onUpdateFolder = (id: string, name: string) => {
		apiWrapper(
			() => updateFolder(id, name),
			(res) => {
				if (res.success) {
					const nextCategories = [...folders];
					folders.map((folder) => {
						if (folder.id === id) {
							folder.name = name;
						}
						return folder;
					});
					setFolders(nextCategories);
					toast.success('Folder has been changed!');
				} else {
					toast.error(': ' + res.error);
				}
			},
			undefined,
			'Unable to update folder'
		);
	};

	const onMoveFileToFolder = (file: File, folder: Folder) => {
		apiWrapper(
			() => moveFileToFolder(file.id, folder.id),
			(res) => {
				if (res.success) {
					toast.success(
						`${file.name} has been moved to ${folder.name}`
					);
				}
			},
			undefined,
			'Unable to move file to folder'
		);
	};

	const onRemoveFileFolder = (file: File) => {
		apiWrapper(
			() => removeFileFromFolder(file.id),
			(res) => {
				if (res.success) {
					toast.success(file.name + ' has been move to Home.');
				}
			},
			undefined,
			'Unable to remove file from folder'
		);
	};

	useEffect(onPageLoaded, [FileOffset]);

	return (
		<div className="my-8 mx-4">
			<div className="flex items-center gap-12 mb-4">
				<h2 className="font-heading text-2xl">Collection</h2>
				<Button
					onClick={() => {
						setIsCreateForm(true);
					}}
					variant="default"
					size="sm"
				>
					Add Folder
				</Button>
				<UploadButton onUploadComplete={onUploadFile} />
			</div>

			<div className="rounded-lg border bg-card text-card-foreground mt-2 mb-8 mr-4 md:mr-16">
				<div className="last:border-0 border-b grid grid-cols-[auto_2rem] sm:grid-cols-[auto_10rem_2rem] px-4 py-2">
					<h1>File name</h1>
					<div className="hidden sm:flex">
						<h1>Update Date</h1>
					</div>
					<h1>Edit</h1>
				</div>
				<DragDropContext
					onDragEnd={(result, provided) => {
						const File = files.find(
							(file) => file.id === result.draggableId
						);
						if (File && result.destination) {
							if (result.destination.droppableId === 'Home') {
								onRemoveFileFolder(File);
							} else {
								const folder = folders.find(
									(folder) =>
										folder.id ===
										result.destination?.droppableId
								);
								if (folder) {
									onMoveFileToFolder(File, folder);
								}
							}
						}
					}}
				>
					<Suspense fallback={<CardSpinner />}>
						{fileFilter.folder && (
							<Droppable droppableId="Home">
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className="last:border-0 border-b"
									>
										<FolderCard
											key={'Home'}
											data={{
												id: '',
												name: 'All File',
												userId: '',
											}}
											onClick={() => {
												onFilterFile({});
											}}
										/>
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						)}
						{folders.map((folder) => (
							<Droppable key={folder.id} droppableId={folder.id}>
								{(provided) => (
									<div
										{...provided.droppableProps}
										ref={provided.innerRef}
										className="last:border-0 border-b"
									>
										<FolderCard
											data={folder}
											onClick={() => {
												const filter = {
													folder: folder.id,
												};
												onFilterFile(filter);
											}}
											editFunction={{
												onDelete: onDeleteFolder,
												onUpdate: onUpdateFolder,
											}}
											isSelected={
												folder.id == fileFilter.folder
											}
										/>
										{provided.placeholder}
									</div>
								)}
							</Droppable>
						))}
						<Droppable droppableId={'File List'}>
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
								>
									{files.map((file, index) => (
										<Draggable
											key={file.id}
											draggableId={file.id}
											index={index}
										>
											{(provided) => (
												<div
													{...provided.dragHandleProps}
													{...provided.draggableProps}
													ref={provided.innerRef}
													className="last:border-0 border-b"
												>
													<FileCard
														data={file}
														folders={folders}
														onDelete={onDeleteFile}
														onRename={onRenameFile}
														onDeleteFolder={
															onRemoveFileFolder
														}
														onMoveToFolder={
															onMoveFileToFolder
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

						{(isFileLoading || isFolderLoading) && <CardSpinner />}
					</Suspense>
				</DragDropContext>
			</div>

			<FolderForm
				open={isCreateForm}
				onOpenChange={setIsCreateForm}
				type="Create"
				onSubmit={(values) => {
					onCreateFolder(values.name);
				}}
			/>
		</div>
	);
};
