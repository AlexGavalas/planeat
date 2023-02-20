# Planeat

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

**Planeat** is an app with which you can create and manage your weekly meal plan and track your weight loss progress.

## Getting Started

After installing the dependencies, running `yarn install --frozen-lockfile`, you can run the development server with `yarn dev` and go to [http://localhost:3000](http://localhost:3000) on your browser to see the page.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Tech

This project uses:

-   [Mantine](https://mantine.dev/) for UI components.
-   [Nivo](https://nivo.rocks/) for the charts.
-   [Supabase](https://supabase.com/) for auth and DB.
-   [Jotai](https://jotai.org/) for global state.
-   [Next-i18n](https://github.com/isaachinman/next-i18next) for translations (EN/GR at the moment).

## Deployment

This project is deployed on [Vercel Platform](https://vercel.com).

## Misc

Interesting API: [spoonacular](https://spoonacular.com/food-api/docs).
