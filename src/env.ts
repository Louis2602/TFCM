import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	server: {
		POSTGRES_URL: z.string().url(),
		NODE_ENV: z.string().min(1),
		OPENAI_API_KEY: z.string().min(1),
		UPLOADTHING_SECRET: z.string().min(1),
		UPLOADTHING_APP_ID: z.string().min(1),
		APP_URL: z.string().url(),
		CLERK_SECRET_KEY: z.string().min(1),
		WEBHOOK_SECRET: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
		NEXT_PUBLIC_SUPABASE_URL: z.string().min(1),
	},
	runtimeEnv: {
		NODE_ENV: process.env.NODE_ENV,
		POSTGRES_URL: process.env.POSTGRES_URL,
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,
		UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
		UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
		APP_URL: process.env.APP_URL,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
			process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_SUPABASE_ANON_KEY:
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
	},
});
