# Healthcare Tracker

A full-stack healthcare management application built with Next.js 15, React 19, Prisma, and NextAuth v5.

## Features

- **Authentication**: Email/password credentials-based auth with JWT sessions
- **Role-Based Access**: Three user roles — User, Doctor, and Admin
- **User Dashboard**: Health checks, activity charts, calendar, and appointment management
- **Doctor Dashboard**: Patient appointments, stats, and appointment management
- **Admin Panel**: Full user management with CRUD operations
- **Appointments**: Create, view, complete, and delete appointments
- **Health Checks**: Track health metrics with progress indicators
- **Responsive Design**: Mobile-friendly with collapsible sidebar

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| ORM | Prisma 6 |
| Database | PostgreSQL |
| Authentication | NextAuth.js v5 (beta) |
| Styling | Plain CSS with CSS custom properties |
| Icons | react-icons |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/Ezad9029/healthcare-tracker.git
cd healthcare-tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL and secrets

# Run database migrations
npm run db:push

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/healthcare_tracker"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Seed Data

The database seeder creates the following accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@healthcare.com | admin123 |
| User | john@example.com | user123 |
| Doctor | drsmith@healthcare.com | doctor123 |
| Doctor | drpatel@healthcare.com | doctor123 |
| Doctor | drchen@healthcare.com | doctor123 |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed the database |
| `npm run db:studio` | Open Prisma Studio |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── doctor/            # Doctor dashboard
│   ├── admin/             # Admin panel
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   └── profile/           # User profile
├── components/            # React components
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
prisma/
├── schema.prisma         # Database schema
└── seed.ts               # Database seeder
```


