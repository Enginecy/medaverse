# Medaverse - Insurance Management System

A comprehensive insurance management platform built with Next.js, featuring agent management, sales tracking, and hierarchical organizational structure.

## 🌟 Overview

Medaverse is a modern web application designed for insurance companies to manage their agents, track sales, handle customer policies, and maintain organizational hierarchies. The platform provides a complete solution for insurance operations with role-based access control and real-time analytics.

## ✨ Key Features

### 🔐 Authentication & Authorization

- **OTP-based Login**: Secure email-based one-time password authentication
- **Development Mode**: Simplified login for development environment
- **Role-based Access Control**: Hierarchical permission system
- **Session Management**: Secure user session handling with Supabase Auth

### 👥 User Management

- **Agent Onboarding**: Complete user registration with profile management
- **Organizational Hierarchy**: Multi-level reporting structure
- **Role Assignment**: From leads to national directors
- **Permission Management**: Granular access control system

### 🏢 Insurance Operations

- **Company Management**: Multi-insurance company support
- **Product Catalog**: Comprehensive insurance product management
- **Sales Tracking**: Detailed sales records and commission tracking
- **Policy Management**: Individual policy tracking with coverage details

### 📊 Dashboard & Analytics

- **Personal Dashboard**: Goal tracking, recent sales, upcoming birthdays
- **Sales Analytics**: Commission tracking, performance metrics
- **Goal Management**: Weekly, monthly, quarterly, and yearly targets
- **Real-time Updates**: Live data synchronization

### 🗺️ Geographic Management

- **USA Map Integration**: State-wise operations visualization
- **Regional Management**: Territory-based organizational structure
- **Location Tracking**: Agent location and coverage area management

## 🛠️ Technology Stack

### Frontend

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/) with Radix UI primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/) & [MUI X Charts](https://mui.com/x/react-charts/)

### Backend & Database

- **Backend**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Real-time**: Supabase Realtime subscriptions

### State Management & Data Fetching

- **Query Management**: [TanStack Query](https://tanstack.com/query/latest) (React Query)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

### Development Tools

- **Package Manager**: [pnpm](https://pnpm.io/)
- **Linting**: [ESLint](https://eslint.org/) with TypeScript support
- **Code Formatting**: [Prettier](https://prettier.io/)
- **Type Checking**: TypeScript strict mode
- **Build Tool**: [Turbo](https://turbo.build/) for faster development

### UI/UX Enhancements

- **Themes**: Dark/Light mode support with next-themes
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) toast notifications
- **File Upload**: React Dropzone for image handling
- **Animation**: Custom animations with Tailwind CSS
- **Loading States**: Skeleton components and loading indicators

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.17.0 or later
- **pnpm** (recommended) or npm
- **Supabase Account** for backend services

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd medaverse
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure Environment Variables**

   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DIRECT_URL=your_direct_database_url
   DATABASE_URL=your_database_url

   # App Configuration
   NODE_ENV=development
   ```

5. **Start Development Server**

   ```bash
   pnpm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
medaverse/
├── public/                     # Static assets
│   ├── favicon.ico
│   ├── meda_health_logo.png
│   └── login-graphics.png
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   └── ...                 # App routes
│   ├── components/             # Reusable components
│   │   ├── ui/                 # Shadcn/ui components
│   │   ├── app-sidebar.tsx     # Main navigation
│   │   └── ...                 # Other shared components
│   ├── features/               # Feature-based modules
│   │   └── ...
│   ├── db/                     # Database configuration
│   │   ├── schema.ts           # Drizzle schema
│   │   ├── db.ts               # Database client
│   │   └── relations.ts        # Table relations
│   ├── lib/                    # Utility libraries
│   │   ├── supabase/           # Supabase utilities
│   │   ├── utils.ts            # Common utilities
│   │   └── react-utils.tsx     # React-specific utilities
│   ├── hooks/                  # Custom React hooks
│   ├── providers/              # React context providers
│   └── styles/                 # Global styles
├── supabase/                   # Supabase configuration
│   ├── config.toml             # Supabase config
│   ├── schema.sql              # Database schema
│   └── policies.sql            # Row Level Security policies
├── database.dbml               # Database documentation
├── database.types.ts           # Generated TypeScript types
└── package.json                # Dependencies and scripts
```

## 🗃️ Database Schema

The application uses a comprehensive PostgreSQL schema designed for insurance operations:

### Core Tables

#### Users & Authentication

- **`users`**: Basic user information and authentication
- **`profile`**: Extended user profiles with roles and personal information
- **`user_hierarchy`**: Organizational structure and reporting relationships
- **`user_permissions`**: Granular permission system

#### Insurance Business

- **`insurance_companies`**: Partner insurance companies
- **`insurance_products`**: Available insurance products and policies
- **`sales`**: Sales transactions and customer information
- **`sale_items`**: Individual policies within sales transactions

#### Enums

- **`status`**: active, disabled, delete
- **`title`**: SuperAdmin, NationalDirector, RegionalDirector, etc.
- **`premium_frequency`**: monthly, quarterly, annually
- **`payment_status`**: pending, paid, overdue, cancelled, refunded

### Security Features

- **Row Level Security (RLS)**: Implemented across all tables
- **Role-based Access**: Hierarchical permission system
- **Data Isolation**: Users can only access authorized data
- **Audit Trail**: Created/updated/deleted timestamps

## 🔧 Available Scripts

```bash
# Development
pnpm run dev              # Start development server with Turbo
pnpm run build            # Build for production
pnpm run start            # Start production server
pnpm run preview          # Build and start production server

# Code Quality
pnpm run lint             # Run ESLint
pnpm run lint:fix         # Fix ESLint issues
pnpm run typecheck        # TypeScript type checking
pnpm run check            # Run lint and typecheck together

# Formatting
pnpm run format:check     # Check code formatting
pnpm run format:write     # Format code with Prettier
```

## 🏗️ Architecture Patterns

### Feature-Based Organization

The project follows a feature-based architecture where each major feature has its own directory containing:

- **Components**: UI components specific to the feature
- **Schemas**: Zod validation schemas
- **Server Actions**: Server-side logic and API calls
- **Data**: Type definitions and mock data

### Component Architecture

- **Compound Components**: Complex UI patterns using composition
- **Server Components**: Leveraging Next.js 15 server components
- **Client Components**: Interactive components with `"use client"`
- **Shared Components**: Reusable UI components in `/components/ui/`

### State Management

- **Server State**: TanStack Query for server state management
- **Form State**: React Hook Form for form management
- **Global State**: React Context for app-wide state
- **Local State**: React useState for component-specific state

## 🔐 Authentication Flow

### Development Mode

- Simplified login with just email address
- Automatic authentication bypass for development
- Debug utilities for testing different user roles
  > Refer to the project lead for the password to login. Password is stored in the .env.local file ONLY ON YOUR LOCAL MACHINE.

### Production Mode

1. **Email Entry**: User enters email address
2. **OTP Generation**: System sends one-time password via email
3. **OTP Verification**: User enters received code
4. **Session Creation**: Supabase creates authenticated session
5. **Profile Loading**: User profile and permissions loaded
6. **Dashboard Redirect**: User redirected to appropriate dashboard

### Security Features

- **Email-based OTP**: No password storage or management
- **Session Management**: Secure JWT tokens with Supabase
- **Role Verification**: Server-side role and permission checking
- **Route Protection**: Middleware-based route authentication

## 🎨 UI/UX Features

### Interactive Elements

- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: Graceful error messages and retry mechanisms
- **Toast Notifications**: Non-intrusive feedback with Sonner
- **Form Validation**: Real-time validation with helpful error messages

### Data Visualization

- **Charts and Graphs**: Sales analytics and goal tracking
- **Interactive Maps**: USA state selection for regional management
- **Progress Indicators**: Goal completion and performance metrics
- **Data Tables**: Sortable, filterable tables with pagination

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add all required environment variables
3. **Build Settings**:
   - Build Command: `pnpm build`
   - Output Directory: `.next`
4. **Deploy**: Automatic deployment on push to main branch

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
DATABASE_URL=your_production_database_url
DIRECT_URL=your_direct_database_url
NODE_ENV=production
```

### Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Supabase project configured
- [ ] Row Level Security policies enabled
- [ ] DNS settings configured
- [ ] SSL certificate installed

## 🤝 Contributing

### Development Workflow

1. **Fork the Repository**: Create your own copy
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Follow Conventions**: Use conventional commits
4. **Code Quality**: Ensure linting and type checking pass
5. **Test Changes**: Manual testing of new features
6. **Submit PR**: Detailed pull request description

### Commit Convention

Following [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add user profile management
fix: resolve authentication redirect issue
docs: update README installation steps
style: format code with prettier
refactor: optimize database queries
test: add unit tests for user validation
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Extended Next.js configuration
- **Prettier**: Consistent code formatting
- **File Naming**: kebab-case for files, PascalCase for components

## 📚 Learning Resources

### Next.js 15

- [App Router Documentation](https://nextjs.org/docs/app)
- [Server Components Guide](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)

### Supabase

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Subscriptions](https://supabase.com/docs/guides/realtime)

### UI Libraries

- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [Tailwind CSS](https://tailwindcss.com/docs)
