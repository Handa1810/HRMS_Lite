# HRMS Lite - HR Management System

A modern, production-ready HR Management System built with React, TypeScript, and Supabase.

## Features

- Employee Management - Add, view, and delete employees
- Attendance Tracking - Mark and track attendance records
- Visual Analytics - Interactive charts and graphs for attendance data
- Real-time Dashboard - Overview of key HR metrics
- Responsive Design - Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (PostgreSQL database with REST API)
- **Charts**: Recharts
- **Routing**: React Router v7
- **State Management**: TanStack Query (React Query)

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account (free tier available at https://supabase.com)

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd hrms-lite
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Supabase project details:

```
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database is already set up

The database schema has been automatically migrated to your Supabase project with:
- `employees` table for storing employee information
- `attendance` table for tracking attendance records
- Row Level Security (RLS) policies for data protection
- Proper indexes for optimal query performance

### 5. Run the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Production Build

Build the application for production:

```bash
npm run build
```

The optimized build will be output to the `dist` directory.

Preview the production build locally:

```bash
npm run preview
```

## Deployment Options

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

3. Set environment variables in Netlify dashboard

### Deploy to Other Platforms

The `dist` folder contains a static build that can be deployed to:
- GitHub Pages
- AWS S3 + CloudFront
- Google Cloud Storage
- Firebase Hosting
- Any static hosting service

## Project Structure

```
hrms-lite/
├── src/
│   ├── api/              # API integration layer
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── ...          # Feature-specific components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and configurations
│   ├── pages/           # Page components
│   └── test/            # Test files
├── supabase/            # Supabase migrations
├── dist/                # Production build output
└── public/              # Static assets
```

## Database Schema

### Employees Table
- `id` - Serial primary key
- `employee_id` - Unique employee identifier
- `full_name` - Employee's full name
- `email` - Employee's email (unique)
- `department` - Department name
- `created_at` - Timestamp
- `updated_at` - Timestamp

### Attendance Table
- `id` - Serial primary key
- `employee_id` - Foreign key to employees
- `date` - Attendance date
- `status` - Present/Absent
- `created_at` - Timestamp

## Security

- Row Level Security (RLS) enabled on all tables
- Environment variables for sensitive data
- Input validation on all forms
- SQL injection protection through Supabase

## License

MIT

## Support

For issues and questions, please open an issue in the GitHub repository.
