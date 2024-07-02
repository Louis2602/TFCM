import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    POSTGRES_URL: z.string().url(),
    NODE_ENV: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    APP_URL: z.string().url(),
    BLOB_READ_WRITE_TOKEN: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    POSTGRES_URL: process.env.POSTGRES_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    APP_URL: process.env.APP_URL,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  },
});
