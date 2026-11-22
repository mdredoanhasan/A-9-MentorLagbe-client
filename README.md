# MentorLagbe (Client)

MentorLagbe is a smart tuition and mentorship platform. Students find verified tutors by subject, class level and mode (online or offline). Tutors post tuition batches and manage applications. Admins review every listing before it goes public.

This repository is the **Next.js client**. The Express API lives in a separate repository (see Links).

## Purpose

Students and parents struggle to find reliable tutors by subject, class level, mode and budget, while skilled tutors lack a simple place to show their batches and manage enrollments. MentorLagbe solves both problems in one place.

## Links

| What | Link |
|---|---|
| Live site | https://mentor-lagbe-client-beta.vercel.app/ |
| Client repository | https://github.com/mdredoanhasan/A-9-MentorLagbe-client |
| Server repository | https://github.com/mdredoanhasan/A-9-MentorLagbe-Server |
| Live API | https://mentor-lagbe-server-chi.vercel.app |

## Test Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `<add admin email>` | `<add admin password>` |
| Tutor | `<add tutor email>` | `<add tutor password>` |
| Student | `<add student email>` | `<add student password>` |

## Key Features

**Public**
- Landing page with banner and featured tuitions
- Browse Tuitions page with server-side search (title or subject), filters (subject, class level, mode) and pagination
- Tuition details page
- Custom 404 and error pages

**Authentication**
- Sign up with full name, email, password and role (Student or Tutor)
- Sign in with email and password
- Session handling with Better Auth and MongoDB
- Role-based route protection. A user who opens another role's page is sent to an Unauthorized page
- Reloading a private page keeps the user signed in

**Student**
- Apply to an approved tuition (one application per tuition)
- Track application status (pending, accepted, rejected)
- Cancel a pending application

**Tutor**
- Post a tuition with a banner image (new posts start as pending)
- Free plan tutors can post up to 2 tuitions
- Edit, delete and open or close their tuitions
- See applicants and accept or reject them

**Admin**
- Platform statistics
- User list and role management
- Approve or reject tuition posts
- View payment transactions

## Tech Stack

- Next.js (App Router) and React
- TypeScript
- Tailwind CSS
- Better Auth with the MongoDB adapter
- MongoDB
- Deployed on Vercel

## npm Packages Used

- `next`
- `react` and `react-dom`
- `typescript`
- `tailwindcss`
- `better-auth`
- `@better-auth/mongo-adapter`
- `mongodb`
- `lucide-react`
- `@radix-ui/react-dropdown-menu`

## Environment Variables

Create a `.env.local` file in the project root. Never commit it.

```env
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
MONGODB_URI=
NEXT_PUBLIC_API_URL=
```

## Run Locally

```bash
git clone https://github.com/mdredoanhasan/A-9-MentorLagbe-client.git
cd A-9-MentorLagbe-client
npm install
npm run dev
```

Open http://localhost:3000. The API server must also be running (see the server repository).

## Build

```bash
npm run build
npm start
```

## Author

Redoan Hasan
GitHub: https://github.com/mdredoanhasan
