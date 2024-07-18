'use server'

import { getCurrentUser } from '@/lib/lucia'
import { db } from '@/db/database'

export const getCategory = async () => {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return { error: 'Not Authorized', success: false }
        }

        const categoriesDB = await db.query.category.findMany({
            where: (category, { eq }) => eq(category.userId, user.id),
        })

        return { success: true, categories: categoriesDB }
    } catch (error: any) {
        return {
            error: `Something went wrong: ${error.message}`,
            success: false,
        }
    }
}
