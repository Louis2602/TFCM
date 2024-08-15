'use server'

import { eq } from 'drizzle-orm'
import { getCurrentUser } from '@/lib/lucia'
import { db } from '@/db/database'
import { file } from '@/db/schema'
import { del } from "@vercel/blob"

export const deleteFile = async (fileId: string) => {
    try {
        const user = await getCurrentUser()
        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        const deleteFile = await db.delete(file).where(eq(file.id, fileId)).returning();
        del(deleteFile.map(f => f.url));        

        return { success: true }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
