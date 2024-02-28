# E-commerce Nextjs Admin CMS

E-commerce custom Admin Content Management System (CMS) built with Next.js, TypeScript, TailwindCSS and shadcn/ui.

## Technology Used:

- Next.js
- TypeScipt
- TailwindCSS
- shadcn/ui
- react-hot-toast
- Clerk User Authentication - Handle user authenication/authorization
- zustand - State management tool
- React Hook Form
- zod
- axios - Data fetching tool
- Prisma - Open-source ORM tool
- Cloudinary - Image and Video Upload API

## Getting Started

### Next.js Application

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Prisma

- Initialize prisma database
  - `npx prisma init` - Initalize prisma that will add prisma directory with schema.prisma file
- Generate and push schema to database
  - `npx prisma generate` - Generate Prisma Client in node_modules
  - `npx prisma db push` - Uses prisma schema to PlanetScale database
- Delete database
  - `npx migrate reset` - Delete entire database; BE CAREFUL!

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
