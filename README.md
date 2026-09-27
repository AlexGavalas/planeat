# Planeat

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

**Planeat** is an app with which you can create and manage your weekly meal plan and track your weight loss progress.

## Getting Started

After installing the dependencies, running `pnpm install`, configure `DATABASE_URL` in `.env.local`, then run the development server with `pnpm dev` and go to [http://localhost:3000](http://localhost:3000) on your browser to see the page.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Tech

This project uses:

-   [Mantine](https://mantine.dev/) for UI components.
-   [Nivo](https://nivo.rocks/) for the charts.
-   [Neon](https://neon.com/) PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/) for the database.
-   [NextAuth](https://next-auth.js.org/) with Google and email/password authentication.
-   [Jotai](https://jotai.org/) for global state.
-   [Next-i18n](https://github.com/isaachinman/next-i18next) for translations (EN/GR at the moment).

## Deployment

This project is deployed on [Vercel Platform](https://vercel.com).

## Database

Copy `.env.example` to `.env.local`. The same `DATABASE_URL` works with Neon and local PostgreSQL.

For a local database, start Docker PostgreSQL and apply the committed Drizzle migration:

```sh
pnpm db:local:up
pnpm db:migrate
```

For Neon, use its pooled connection string as `DATABASE_URL` for the app and
its direct connection string as `DATABASE_URL_UNPOOLED` for migrations. The
Drizzle configuration falls back to `DATABASE_URL` for local PostgreSQL.

## End-to-end tests

Playwright uses a separate PostgreSQL database and never uses `DATABASE_URL`
from the development environment. Copy the example environment, start the
ephemeral database, and run the suite:

```sh
cp .env.e2e.example .env.e2e
mise exec -- pnpm db:e2e:up
mise exec -- pnpm test:e2e
```

The test setup applies the committed Drizzle migrations, clears the e2e
database, and seeds a credentials user before each suite. The reset is guarded
and refuses to run unless the configured database name contains `e2e`.

Stop the local e2e database with:

```sh
mise exec -- pnpm db:e2e:down
```

Vercel preview deployments use the Neon branch injected by the Neon–Vercel
integration. Preview builds apply committed Drizzle migrations to their isolated
branch, while production builds apply them to the production branch. After a
preview deployment succeeds, GitHub Actions runs Playwright against the preview
URL and registers a unique credentials user through the application; the
workflow does not need a Neon API key or database connection string.

## Misc

Interesting API: [spoonacular](https://spoonacular.com/food-api/docs).
