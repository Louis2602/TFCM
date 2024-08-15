'use server';

import { createId } from '@paralleldrive/cuid2';
import { getCurrentUser } from '@/lib/lucia';
import { db } from '@/db/database';
import { folder as folderTable } from '@/db/schema';

export const createFolder = async (name: string) => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}

		const existingFolder = await db.query.folder.findFirst({
			where: (folder, { eq }) => eq(folder.name, name),
		});

		if (existingFolder) {
			return { error: 'Folder already exists', success: false };
		}

		const [newFolder] = await db
			.insert(folderTable)
			.values({
				id: createId(),
				userId: user.id,
				name: name,
			})
			.returning();

		return { success: true, newFolder: newFolder };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};
