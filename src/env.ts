import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    POSTGRES_URL: z.string().url(),
    NODE_ENV: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    APP_URL: z.string().url(),
    BLOB_READ_WRITE_TOKEN: z.string().min(1),
    GOOGLE_TRENDS_API_KEY: z.string().min(1),
    GOOGLE_TRENDS_REALTIME_URL: z.string().url(),
    UPLOADTHING_SECRET: z.string().min(1),
    UPLOADTHING_APP_ID: z.string().min(1),
    RITEKIT_TRENDS_API_KEY: z.string().min(1),
    RITEKIT_TRENDS_REALTIME_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    POSTGRES_URL: process.env.POSTGRES_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    APP_URL: process.env.APP_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    GOOGLE_TRENDS_REALTIME_URL: process.env.GOOGLE_TRENDS_REALTIME_URL,
    GOOGLE_TRENDS_API_KEY: process.env.GOOGLE_TRENDS_API_KEY,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    RITEKIT_TRENDS_REALTIME_URL: process.env.RITEKIT_TRENDS_REALTIME_URL,
    RITEKIT_TRENDS_API_KEY: process.env.RITEKIT_TRENDS_API_KEY,
  },
});
