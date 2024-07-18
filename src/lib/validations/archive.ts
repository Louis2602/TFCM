import * as z from 'zod'

export const CategorySchema = z.object({
    name: z
        .string()
        .min(2, {
            message: 'Category name must be at least 2 characters long',
        })
        .max(50),
})

export const renameContentSchema = z.object({
    title: z
        .string({
            required_error: 'Please add article title',
        })
        .min(3, {
            message: 'Article title must be at least 3 characters',
        })
        .max(50, {
            message: 'Article title must be no longer than 50 characters',
        }),
})
