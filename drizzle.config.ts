import { env } from '@/env';
import { defineConfig, Config } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/db/schema.ts',
	dbCredentials: {
		url: env.POSTGRES_URL,
	},
	out: './drizzle',
	verbose: true,
	strict: true,
}) satisfies Config;
