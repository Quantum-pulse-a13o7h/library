# LibriSys - Library Management System

## Overview

LibriSys is a full-stack library management application that allows users to browse a book catalog, borrow books, and manage loans. The system features a React frontend with a warm, intellectual design aesthetic and an Express backend with PostgreSQL database storage.

Key features:
- Book catalog with search and category filtering
- Book borrowing system with due date tracking
- Admin dashboard for managing inventory and tracking active/returned loans
- Responsive UI with smooth animations

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom warm color palette (terracotta primary, parchment secondary, sage accents)
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Forms**: React Hook Form with Zod validation
- **Typography**: Playfair Display (display font) and Lato (body font)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: RESTful endpoints defined in shared routes file with Zod schemas for validation
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Build System**: Vite for frontend, esbuild for server bundling

### Data Storage
- **Database**: PostgreSQL
- **Schema**: Two main tables - `books` (inventory) and `loans` (borrowing records)
- **Migrations**: Drizzle Kit for schema migrations (`npm run db:push`)

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # UI components including shadcn/ui
│   │   ├── hooks/        # Custom React hooks (use-books, use-loans)
│   │   ├── pages/        # Route components (Home, Catalog, Admin)
│   │   └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── routes.ts     # API route handlers
│   ├── storage.ts    # Database storage implementation
│   └── db.ts         # Database connection
├── shared/           # Shared between frontend and backend
│   ├── schema.ts     # Drizzle schema and Zod types
│   └── routes.ts     # API route definitions with validation
```

### Key Design Decisions
1. **Shared Types**: Schema and route definitions in `/shared` ensure type safety across frontend and backend
2. **API Contract**: Routes defined with Zod schemas for input validation and response typing
3. **Component Library**: shadcn/ui provides accessible, customizable components without heavy dependencies
4. **Query Pattern**: React Query handles caching, refetching, and mutation state management

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database toolkit for TypeScript with schema definition and migrations

### UI/Frontend Libraries
- **Radix UI**: Headless component primitives for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **date-fns**: Date formatting and manipulation

### Build Tools
- **Vite**: Frontend dev server and bundler
- **esbuild**: Server bundling for production
- **TypeScript**: Static typing across the stack

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string