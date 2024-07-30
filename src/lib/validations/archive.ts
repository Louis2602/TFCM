import * as z from 'zod'

export const CategorySchema = z.object({
    name: z
        .string()
        .min(2, {
            message: 'Category name must be at least 2 characters long',
        })
        .max(50, {
            message: 'Category name must be no longer than 50 characters',
        }),
})
