'use server'

import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/lucia'
import { db } from '@/db/database'
import { category as categoryTable } from '@/db/schema'

export const updateCategory = async (id: string, name: string) => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        const existingCategory = await db.query.category.findFirst({
            where: (category, { and, eq }) =>
                and(eq(category.name, name), eq(category.userId, user.id)),
        })

        if (existingCategory) {
            return { error: 'Category already exists', success: false }
        }

        await db
            .update(categoryTable)
            .set({ name: name })
            .where(eq(categoryTable.id, id))

        return { success: true }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
