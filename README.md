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

### Step 1: Clone this repository

```bash
git clone https://github.com/Louis2602/tfcm
```

### Step 2: Push Your Code to a Git Repository

Your code needs to be in a Git repository on GitHub, GitLab, or Bitbucket.

1. **Initialize a Git repository** (if you haven’t already).

   ```bash
   git init
   ```

2. **Add your files to the repository**.

   ```bash
   git add .
   ```

3. **Commit your changes**.

   ```bash
   git commit -m "Initial commit"
   ```

4. **Add the remote repository**.

   ```bash
   git remote add origin <your-repository-url>
   ```

5. **Push your code to the repository**.

   ```bash
   git push -u origin main
   ```

### Step 3: Connect Your Repository to Vercel

1. **Login to Vercel**: Go to [Vercel](https://vercel.com/) and log in with your account.

2. **Import Project**:

   - Click on the “New Project” button on your dashboard.
   - Select the Git provider where your repository is hosted (GitHub, GitLab, or Bitbucket).
   - Authorize Vercel to access your repositories if prompted.

3. **Select Repository**: Choose the repository containing your Next.js app.

4. **Configure Project**:

   - Ensure the project name and root directory are correct.
   - Vercel will automatically detect it’s a Next.js project and apply the appropriate settings.

5. **Environment Variables**: If your application requires environment variables, add them in the "Environment Variables" section.

```bash
NODE_ENV=development

# OpenAI
OPENAI_API_KEY=
# UploadThing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

# App URL
APP_URL="http://localhost:3000"

POSTGRES_URL=

# Stripe
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PLAN_100=
STRIPE_PLAN_200=
STRIPE_PLAN_350=
STRIPE_PLAN_500=
```

### Step 4: Deploy Your Next.js App

1. **Deploy**: Click on the “Deploy” button. Vercel will start the deployment process.
2. **Monitor Deployment**: You can monitor the build logs to see the progress of your deployment.
3. **Access Your App**: Once the deployment is complete, Vercel will provide you with a URL to access your deployed application.

### Step 5: Configure Domain (Optional)

If you have a custom domain, you can configure it in Vercel:

1. **Add Domain**:

   - Go to the “Domains” tab in your project settings.
   - Click on “Add Domain” and enter your custom domain.

2. **Update DNS Settings**:

   - Update your domain's DNS settings to point to Vercel. This usually involves adding an A record or CNAME record as instructed by Vercel.

3. **Verify Domain**: Once DNS settings are updated, click on “Verify” in Vercel to confirm the domain setup.

### Step 6: Configure Continuous Deployment (Optional)

For continuous deployment, you can configure Vercel to automatically deploy your app whenever you push changes to the main branch.

1. **Branch Settings**:

   - Go to the “Git” tab in your project settings.
   - Ensure the main branch is selected for automatic deployments.

2. **Deploy Hooks** (Optional):
   - You can set up deploy hooks to trigger deployments from other sources or scripts.
