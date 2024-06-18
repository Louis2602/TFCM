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

## Deployment Guide

Step 1: Clone this repository

```bash
git clone
```

Set up all the environments needed:

```bash
NODE_ENV=development

# AUTH - Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
WEBHOOK_SECRET=

# OpenAI
OPENAI_API_KEY=
# UploadThing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# App URL
APP_URL="http://localhost:3000"

POSTGRES_URL=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Stripe
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PLAN_100=
STRIPE_PLAN_200=
STRIPE_PLAN_350=
STRIPE_PLAN_500=
```
