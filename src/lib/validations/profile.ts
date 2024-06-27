import * as z from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Your name must be at least 2 characters long",
    })
    .max(50)
    .optional(),
  picture: z
    .string()
    .url({
      message: "Please provide valid URL",
    })
    .optional(),
});
