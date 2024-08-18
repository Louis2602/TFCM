'use client';

import { Button } from '@/components/ui/button';
import { Loader } from '@/components/global/loader';
import { useState } from 'react';
import { toast } from 'sonner';
import { File as FileDB } from '@/types/db';

interface UploadButtonProps {
  folder?: string;
	onUploadComplete: (url: FileDB) => void;
}

export const onUpload = (file: File) => {
	const promise = fetch('/api/upload', {
		method: 'POST',
		headers: {
			'content-type': file?.type || 'application/octet-stream',
			'x-vercel-filename': file?.name || 'image.png',
		},
		body: file,
	});

	return new Promise<FileDB>((resolve) => {
		toast.promise(
			promise.then(async (res) => {
				if (res.status === 200) {
					const apiReturn = (await res.json()) as FileDB;
					resolve(apiReturn);
				} else if (res.status === 401) {
					throw new Error(
						'`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.'
					);
				} else {
					throw new Error(`Error uploading image. Please try again.`);
				}
			}),
			{
				loading: 'Uploading file...',
				success: 'Image uploaded successfully.',
				error: (e) => e.message,
			}
		);
	});
};

export const UploadButton = ({ folder, onUploadComplete }: UploadButtonProps) => {
	const [isUploading, setIsUploading] = useState(false);
	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.currentTarget.files) return null;

		const selectedFile = e.currentTarget.files[0];

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
		if (!allowedTypes.includes(selectedFile?.type)) {
			toast.error('Only .png, .jpeg and .webp file types are allowed');
		} else if (selectedFile.size / 1024 / 1024 > 20) {
			toast.error('File size too big (max 20MB).');
		}

		setIsUploading(true);
		const uploadReturn = await onUpload(selectedFile);
		setIsUploading(false);

		onUploadComplete(uploadReturn);
	};

	return (
		<Button
			type="button"
			variant="outline"
			className="relative w-fit"
			disabled={isUploading}
		>
			<label className="absolute inset-0 w-full h-full cursor-pointer">
        <input
					type="file"
					className="hidden"
					onChange={handleFileChange}
				/>
			</label>
      <input type='hidden' name='folder' value={folder}/>
			{isUploading && <Loader />}
			Upload file
		</Button>
	);
};
