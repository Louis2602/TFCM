'use server';

import { db } from '@/db/database';
import { user as userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { updateProfileSchema } from '../validations/profile';
import { currentUser } from '@clerk/nextjs/server';
import { z } from 'zod';

export async function updateUserImage(imageUrl: string) {
	try {
		const user = await currentUser();

		if (!user) {
			throw new Error('Unauthorized');
		}

		const updateData = {
			imageUrl,
			updatedAt: new Date(),
		};

		await db
			.update(userTable)
			.set(updateData)
			.where(eq(userTable.id, user.id));

		revalidatePath(`/dashboard/settings`);

		return {
			success: true,
			message: `Update profile image successfully`,
		};
	} catch (error) {
		return { success: false, message: `Something went wrong: ${error}` };
	}
}

export async function updateUserProfile(
	formData: z.infer<typeof updateProfileSchema>
) {
	try {
		const user = await currentUser();

		if (!user) {
			throw new Error('Unauthorized');
		}

		const data = updateProfileSchema.parse(formData);

		const updateData = {
			...data,
			updatedAt: new Date(),
		};
		await db
			.update(userTable)
			.set(updateData)
			.where(eq(userTable.id, user.id));

		revalidatePath(`/dashboard/settings`);

		return { success: true, message: `Update profile successfully` };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { success: false, message: JSON.stringify(error.issues) };
		}

		return { success: false, message: `Something went wrong: ${error}` };
	}
}
