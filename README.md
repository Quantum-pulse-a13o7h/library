Librarian‑Hub is a full‑stack Library Management system designed to manage a book catalog and lending operations with a clean, modern UI.
The frontend is built with React and Vite for fast, responsive UX, while the backend exposes a RESTful API using Express. Data is persisted in PostgreSQL (Neon), and the client communicates with the server via typed routes, ensuring consistent contracts across the stack. The project is deployed with a split architecture: Vercel serves the frontend, and Render hosts the backend API.

Core Features

Book catalog management: create, list, update, and delete books
Lending workflow: create loans, return loans, and track availability
Availability logic: borrowed books decrement availability, returns restore it
Validation: Zod schemas enforce data integrity on both client and server
Typed API contracts shared across frontend and backend
Production builds with optimized bundling for both client and server
Architecture

Frontend consumes /api/* endpoints via a Vercel rewrite that proxies to Render
Backend handles all CRUD and loan operations and interacts with the database via Drizzle ORM
Schema and API routes are shared to guarantee type consistency
PostgreSQL stores persistent data with separate local and production URLs
Tech Stack

Frontend: React, Vite, TypeScript
Styling: Tailwind CSS
Data fetching and caching: TanStack React Query
Routing: Wouter
Backend: Node.js, Express
Database: PostgreSQL (Neon)
ORM and schema: Drizzle ORM, Zod
Build pipeline: Vite (client), esbuild (server bundling)
Deployment: Vercel (frontend), Render (backend)
Deployment Details

Frontend hosted on Vercel
Backend hosted on Render
Vercel rewrite proxies /api/* to Render backend
Database hosted on Neon with SSL connection
Environment Configuration

DATABASE_URL required on the backend (Render)
Optional DB_SSL=true if the DB requires SSL and the URL doesn’t include it
