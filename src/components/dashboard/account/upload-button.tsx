'use client';

import { generateReactHelpers } from '@uploadthing/react/hooks';
import { Icons } from '@/components/global/icons';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import type { UseFormReturn } from 'react-hook-form';
import { Loader } from '@/components/global/loader';

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface UploadButtonProps {
	form: UseFormReturn;
	onUploadComplete: (url: string) => void;
}

export const UploadButton = ({ form, onUploadComplete }: UploadButtonProps) => {
	const { startUpload, isUploading } = useUploadThing('imageUploader', {
		onClientUploadComplete: (file) => {
			if (!file) return;
			const imageUrl = file[0].url;
			form.setValue('imageUrl', imageUrl, {
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			});
			onUploadComplete(imageUrl);
			toast({
				title: 'Uploaded done',
				description: 'Change avatar successfully',
			});
		},
		onUploadError: (error) => {
			toast({
				title: 'Your image is not uploaded',
				description: error.message,
				variant: 'destructive',
			});
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.currentTarget.files) return null;

		const selectedFile = e.currentTarget.files[0];

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
		if (!allowedTypes.includes(selectedFile?.type)) {
			return form.setError('imageUrl', {
				message: 'Only .png, .jpeg, and .webp file types are allowed',
			});
		}

		startUpload([selectedFile]);
	};

	return (
		<Button
			type='button'
			variant='outline'
			className='relative w-fit'
			disabled={isUploading}
		>
			<label className='absolute inset-0 w-full h-full cursor-pointer'>
				<input
					type='file'
					className='hidden'
					onChange={handleFileChange}
				/>
			</label>
			{isUploading && (
				<Loader />
			)}
			Change photo
		</Button>
	);
};
