'use server';

import { createId } from '@paralleldrive/cuid2';
import { getCurrentUser } from '@/lib/lucia';
import { db } from '@/db/database';
import { category as categoryTable } from '@/db/schema';

export const createCategory = async (name: string) => {
	try {
		const user = await getCurrentUser();

		if (!user) {
			return { error: 'Not Authorized', success: false };
		}

		const existingCategory = await db.query.category.findFirst({
			where: (category, { eq }) => eq(category.name, name),
		});

		if (existingCategory) {
			return { error: 'Category already exists', success: false };
		}

		const [newCategory] = await db
			.insert(categoryTable)
			.values({
				id: createId(),
				userId: user.id,
				name: name,
			})
			.returning();

		return { success: true, newCategory: newCategory };
	} catch (error: any) {
		return {
			error: `Something went wrong: ${error.message}`,
			success: false,
		};
	}
};
