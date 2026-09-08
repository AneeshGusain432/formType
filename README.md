# FormType

FormType is a full-stack form builder and response collection platform built with a Turborepo monorepo architecture. It allows users to create forms, configure fields, share public links, and review submissions from a protected dashboard.

## Overview

This project is structured around a modern SaaS-style workflow:

- Users sign up or log in with email/password or Google OAuth.
- Authenticated users can create, edit, and delete forms from a dashboard.
- Each form supports multiple field types, custom labels, placeholder text, and required validation.
- Public forms can be filled out without authentication using a shareable link.
- Submissions are stored securely and can be reviewed in the dashboard.
- The app exposes a typed tRPC API across web and backend layers.

## Core Features

### Authentication and account management
- Email/password sign up and sign in
- Google sign-in flow
- JWT-based access and refresh token handling
- Protected dashboard routing
- Logout and session cleanup

### Form builder
- Create a form with title and description
- Add form fields with configurable options
- Supported field types include:
  - Text
  - Number
  - Email
  - Yes / No
  - Password
- Edit existing forms and replace field definitions
- Delete forms with associated submissions and field records

### Public form experience
- Public pages render a form for anonymous responders
- Required fields are validated before submission
- Submission success state and error messaging are shown in the UI
- Response payload is accepted without needing signed-in access

### Dashboard analytics and management
- User-specific form listing
- Submission metrics and dashboard cards
- Overview of recent form activity and submission data
- Form editing and management from the dashboard UI

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Lucide and Tabler icon libraries

### Backend and API
- tRPC
- Express-compatible server layer
- JWT authentication handling
- Google auth integration
- Shared validation models and service layer

### Data layer
- PostgreSQL
- Drizzle ORM
- Database schema for users, forms, form fields, and submissions

### Tooling and infrastructure
- pnpm workspaces
- Turbo monorepo orchestration
- Docker Compose for API and web deployment
- TypeScript project references across workspaces

## Repository Architecture

```text
form-type/
├── apps/
│   ├── api/                 # API server and server-side runtime
│   └── web/                # Next.js frontend application
├── packages/
│   ├── database/           # Drizzle schema and DB config
│   ├── eslint-config/      # Shared lint config
│   ├── logger/             # Logging utilities
│   ├── services/           # Business logic for auth and forms
│   ├── trpc/               # Shared tRPC server/client contracts
│   └── typescript-config/  # Shared TS configuration
├── docker-compose.yml
├── Dockerfile
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## App Responsibilities

### apps/web
The web app contains:
- Landing page and marketing layout
- Authentication pages for login and signup
- Protected dashboard screens
- Form creation and editing screens
- Public form render pages
- Shared UI components and API hooks

### apps/api
The API app hosts the backend server and exposes the tRPC endpoints used by the web client.

### packages/trpc
This package contains:
- router definitions
- input and output validation schemas
- auth middleware and protected procedures
- shared path generation utilities

### packages/services
This package contains the business logic for:
- user signup and signin
- Google authentication
- form creation, updates, deletion, and retrieval
- submission processing and submission queries
- dashboard statistics

### packages/database
This package owns the database schema and Drizzle configuration, including models for:
- users
- forms
- form fields
- form submissions
- answers linked to each submission

## Environment and Setup

### Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL
- Docker (optional, for local containerized development)

### Install dependencies

```bash
pnpm install
```

### Run the project

From the root:

```bash
pnpm dev
```

This starts the workspace apps through Turbo.

### Database generation and migration

```bash
pnpm db:generate
pnpm db:migrate
```

### Docker

The project includes a Docker Compose setup for API and web services:

```bash
docker compose up --build
```

## Key User Flow

1. A user signs up or logs in.
2. The dashboard loads their forms and metrics.
3. The user creates a form by adding fields and metadata.
4. The application stores the form and fields in the database.
5. The user shares the public form URL.
6. Responders complete the form and submit answers.
7. Submissions are stored and available in the dashboard for review.

## Project Status

This repository is currently organized as a production-style form platform with a working monorepo structure, typed API boundaries, protected user flows, and data persistence for form content and responses.

## Notes

The README was updated to match the actual architecture and feature implementation present in this workspace, rather than the default Turborepo template.
