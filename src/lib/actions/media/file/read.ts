'use server';

import { getCurrentUser } from '@/lib/lucia';
import { db } from '@/db/database';
import { FileSearchFilter } from '@/types/media';

export const getFile = async (id: string) => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}

		let file = await db.query.file.findFirst({
			where: (file, { and, eq }) =>
				and(eq(file.id, id), eq(file.userId, user.id)),
		});

		if (!file) {
			return { success: false, error: 'File not found' };
		}

		return { success: true, file };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};

export const getFiles = async (
	offset: number,
	size: number,
	filter?: FileSearchFilter
) => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}

		let filesDB = await db.query.file.findMany({
			where: (content, { eq }) => eq(content.userId, user.id),
			orderBy: (content, { desc }) => [desc(content.updatedAt)],
		});

		if (filter?.folder) {
			filesDB = filesDB.filter((file) => file.folderId === filter.folder);
		}

		const files = filesDB.slice(offset, offset + size);

		return { success: true, files, size: filesDB.length };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};
