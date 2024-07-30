'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/db/database'
import { content as contentTable } from '@/db/schema'
import { getCurrentUser } from '@/lib/lucia'

export const moveContentToCategory = async (
    contentId: string,
    categoryId: string
) => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        await db
            .update(contentTable)
            .set({ categoryId: categoryId })
            .where(eq(contentTable.id, contentId))

        return { success: true }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}

export const removeContentCategory = async (contentId: string) => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        await db
            .update(contentTable)
            .set({ categoryId: null })
            .where(eq(contentTable.id, contentId))

        return { success: true }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
