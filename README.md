## Getting Started

Install all npm packages:
```bash
npm install
```

## Development

To get `*.env` file, contact `ttlam.dev@gmail.com`. Do not leak, share or spam any of these api keys, because it is charged money.

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Run the ngrok server to run webhook for login:
```bash
ngrok http 3000 --domain safely-brave-lynx.ngrok-free.app
```

Note that this ngrok server is free, so that it can only be run by 1 person. 
Try to create your account first, then it won't be needed to run ngrok server

If you want to create any new schemas for the database, create it in `src/db/schema.ts`

Remember, after create or modify a schema, must generate a migration script and push it to the database to update

Generate migration script:

```bash
npm run generate
```

Push migration script:
```bash
npm run push
```

Run Drizzle Studio to view the database:
```bash
npm run studio
```

For more commands, take a look in `package.json` file and in the drizzle-orm documentation pages.
