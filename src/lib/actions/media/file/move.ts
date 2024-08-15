'use server'

import { eq } from 'drizzle-orm'
import { db } from '@/db/database'
import { file } from '@/db/schema'
import { getCurrentUser } from '@/lib/lucia'

export const moveFileToFolder = async (
    fileId: string,
    folderId: string
) => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        await db
            .update(file)
            .set({ folderId: folderId })
            .where(eq(file.id, fileId))

        return { success: true }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}

export const removeFileFromFolder = async (fileId: string) => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        await db
            .update(file)
            .set({ folderId: null })
            .where(eq(file.id, fileId))

        return { success: true }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
