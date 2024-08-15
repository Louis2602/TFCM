'use server'

import { getCurrentUser } from '@/lib/lucia'
import { db } from '@/db/database'

export const getFolder = async () => {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        const foldersDB = await db.query.folder.findMany({
            where: (folder, { eq }) => eq(folder.userId, user.id),
        })

        return { success: true, folders: foldersDB }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
