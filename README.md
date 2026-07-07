# User Management

A full-stack user management application with role-based access control. It supports two kinds of users — **normal users** and **admin users** — each with their own login and signup flows.

## Tech Stack

**Frontend**
- React (SPA)
- Tailwind CSS
- React Router (routing)
- Axios (API requests)

**Backend**
- Node.js + Express
- MongoDB (with Mongoose ODM)
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

## Features

- Signup and login for **normal users**
- Signup and login for **admin users**
- Role-based access control (RBAC): routes and pages are protected based on the user's role
- JWT-based authentication with protected API endpoints
- Passwords hashed with bcrypt (never stored in plain text)
- Admin dashboard to view and manage normal users
- User profile for normal users
- Client-side and server-side input validation

## Project Structure

```
UserManagement/
├── client/                 # React + Tailwind frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Login, Signup, Dashboard, Profile, etc.
│   │   ├── context/        # Auth context / global state
│   │   ├── services/       # API calls (axios)
│   │   ├── utils/          # Helpers (token storage, guards)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                 # Express + MongoDB backend
│   ├── src/
│   │   ├── config/         # DB connection, env
│   │   ├── controllers/    # Route handlers (auth, user, admin)
│   │   ├── middleware/     # auth, role check, error handling
│   │   ├── models/         # Mongoose schemas (User)
│   │   ├── routes/         # API route definitions
│   │   └── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

## User Roles

| Role   | Signup | Login | Capabilities                                          |
|--------|--------|-------|-------------------------------------------------------|
| user   | ✅     | ✅    | Manage own profile, view own data                     |
| admin  | ✅     | ✅    | Everything a user can, plus view/manage all users     |

The role is stored on the user document (e.g. `role: "user" | "admin"`) and enforced by backend middleware on every protected route.

## API Endpoints (planned)

### Auth
| Method | Endpoint                  | Description                       | Access |
|--------|---------------------------|-----------------------------------|--------|
| POST   | `/api/auth/signup`        | Register a normal user            | Public |
| POST   | `/api/auth/login`         | Log in a normal user              | Public |
| POST   | `/api/auth/admin/signup`  | Register an admin user            | Public |
| POST   | `/api/auth/admin/login`   | Log in an admin user              | Public |
| GET    | `/api/auth/me`            | Get the current logged-in user    | Auth   |

### Users
| Method | Endpoint            | Description                    | Access      |
|--------|---------------------|--------------------------------|-------------|
| GET    | `/api/users`        | List all users                 | Admin       |
| GET    | `/api/users/:id`    | Get a single user              | Admin/Owner |
| PUT    | `/api/users/:id`    | Update a user                  | Admin/Owner |
| DELETE | `/api/users/:id`    | Delete a user                  | Admin       |

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- MongoDB (local instance or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone <repo-url>
cd UserManagement
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/user_management
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (frontend) and the API at `http://localhost:5000` (backend).

## Environment Variables

### Server (`server/.env`)
| Variable         | Description                          |
|------------------|--------------------------------------|
| `PORT`           | Port the Express server runs on      |
| `MONGO_URI`      | MongoDB connection string            |
| `JWT_SECRET`     | Secret used to sign JWTs             |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`)           |

### Client (`client/.env`)
| Variable       | Description                    |
|----------------|--------------------------------|
| `VITE_API_URL` | Base URL of the backend API    |

## Security Notes

- Passwords are hashed with bcrypt before being stored.
- Never commit `.env` files — they are listed in `.gitignore`.
- JWTs are signed with a strong secret and have an expiry.
- All admin-only routes are guarded by role-checking middleware on the server (never rely on the client alone).

## License

MIT
