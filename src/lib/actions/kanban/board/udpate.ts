'use server'

import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/lucia'
import { db } from '@/db/database'
import { kanban } from '@/db/schema'

export const updateBoard = async (id: string, name: string) => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        const existingBoard = await db.query.category.findFirst({
            where: (category, { and, eq }) =>
                and(eq(category.name, name), eq(category.userId, user.id)),
        })

        if (existingBoard) {
            return { error: 'Board already exists', success: false }
        }

        await db
            .update(kanban)
            .set({ name: name })
            .where(eq(kanban.id, id))

        return { success: true }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
