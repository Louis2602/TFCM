import { db } from '@/db/database';
import { file as fileDb } from '@/db/schema';
import { getCurrentUser } from '@/lib/lucia';
import { createId } from '@paralleldrive/cuid2';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';

const f = createUploadthing();

export const ourFileRouter = {
	imageUploader: f({
		image: { maxFileSize: '4MB', maxFileCount: 1 },
		video: { maxFileSize: '16MB', maxFileCount: 1 },
	})
		.middleware(async ({ req }) => {
			const user = await getCurrentUser();

			if (!user) throw new UploadThingError('Unauthorized');

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			db.insert(fileDb).values({
				id: createId(),
				name: file.name,
				url: file.url,
				type: file.type,
				userId: metadata.userId,
			});

			return { name: file.name, url: file.url, uploadedBy: metadata.userId };
		}),
	videoUploader: f({ video: { maxFileSize: '16MB', maxFileCount: 1 } })
		.middleware(async ({ req }) => {
			const user = await getCurrentUser();

			if (!user) throw new UploadThingError('Unauthorized');

			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			db.insert(fileDb).values({
				id: createId(),
				name: file.name,
				url: file.url,
				type: file.type,
				userId: metadata.userId,
			});

			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
