# Project Cost Tracker Application

## Overview
This is a full-stack web application for tracking project costs. It allows users to manage project items and other costs, authenticate with Firebase, and visualize their expenses.

The application uses a React frontend with Redux state management and a Node.js/Express backend. The data is stored in a database using Drizzle ORM, and the UI is built with Tailwind CSS and shadcn/ui components.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **State Management**: Redux with slice pattern
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Styling**: Tailwind CSS with a custom theme
- **Authentication**: Firebase Authentication
- **API Client**: React Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API**: RESTful endpoints for CRUD operations
- **Database Access**: Drizzle ORM for type-safe SQL operations
- **Authentication**: Firebase Authentication integration with database user records

### Database
- **ORM**: Drizzle ORM
- **Schema**: User profiles, project items, other costs
- **Migrations**: Drizzle kit for schema migrations

## Key Components

### Frontend Components
1. **Auth System**
   - Firebase integration for user authentication
   - Support for email/password and Google authentication
   - Redux state to track authentication status

2. **Dashboard**
   - Overview of project costs with totals and visualizations
   - Management of project items and other costs
   - Search and filtering capabilities

3. **Modals**
   - Add/edit project items
   - Add/edit other costs
   - Confirmation dialogs for deletions

4. **UI Components**
   - Complete shadcn/ui component library implementation
   - Toast notifications for user feedback
   - Responsive layout with mobile support

### Backend Components
1. **API Routes**
   - User management endpoints
   - Project items CRUD operations
   - Other costs CRUD operations

2. **Storage Interface**
   - Abstract interface for data operations
   - In-memory implementation for development/testing
   - Database implementation for production

3. **Express Middleware**
   - Request logging
   - Error handling
   - Static file serving for frontend assets

## Data Flow

1. **Authentication Flow**
   - User authenticates with Firebase
   - Backend validates Firebase ID token
   - User information is stored/retrieved from database
   - Redux state is updated with authenticated user data

2. **Data Management Flow**
   - User performs CRUD operations through UI
   - Redux actions are dispatched
   - API requests are made to backend
   - Backend validates requests and performs database operations
   - Results are returned to frontend and state is updated
   - UI reflects the updated state

## External Dependencies

### Frontend Dependencies
- **@radix-ui/react-*** - UI primitives for accessible components
- **@tanstack/react-query** - Data fetching and cache management
- **firebase** - Authentication services
- **redux** - State management
- **tailwindcss** - Utility-first CSS framework
- **wouter** - Lightweight routing

### Backend Dependencies
- **express** - Web server framework
- **drizzle-orm** - Database ORM
- **zod** - Schema validation
- **firebase-admin** - Server-side Firebase integration

## Deployment Strategy
The application is configured to be deployed on Replit's infrastructure:

1. **Development Mode**
   - `npm run dev` starts both frontend and backend in development mode
   - Vite handles frontend hot module replacement
   - Backend restarts on file changes

2. **Production Build**
   - `npm run build` compiles frontend assets and bundles the server
   - Frontend assets are served from the `dist/public` directory
   - The backend is compiled to `dist/index.js`

3. **Production Run**
   - `npm run start` runs the compiled server in production mode
   - The server serves the static frontend files
   - API requests are handled by the Express backend

## Database Setup
The application uses Drizzle ORM and is configured to work with PostgreSQL:

1. **Schema**
   - User profiles with Firebase UID association
   - Project items with cost tracking
   - Other costs with descriptions and amounts

2. **Migrations**
   - Drizzle Kit handles schema migrations
   - `npm run db:push` applies schema changes to the database

## Getting Started

1. Ensure the PostgreSQL module is enabled in your Replit
2. Set up the required environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `VITE_FIREBASE_API_KEY` - Firebase API key (optional, fallbacks provided)
   - `VITE_FIREBASE_PROJECT_ID` - Firebase project ID (optional, fallbacks provided)

3. Run `npm install` to install dependencies
4. Run `npm run db:push` to set up the database schema
5. Run `npm run dev` to start the development server
