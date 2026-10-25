# Student Management System

A full-stack student management application built with the MERN stack. It includes JWT-based authentication, role-based access, student record management, and a statistics dashboard.

## Live Demo

- **Website:** [student-management-system-qtnt.vercel.app](https://student-management-system-qtnt.vercel.app)
- **Backend API:** [student-management-system-sand-five.vercel.app](https://student-management-system-sand-five.vercel.app)
- **GitHub:** [sadafiqbal91/student-management-system](https://github.com/sadafiqbal91/student-management-system)

## Features

- Register, log in, and log out with JWT authentication
- Add, edit, delete, search, and view student details
- Dashboard with total student count, recent registrations, a search bar, and statistics cards
- Paginated student listings
- Role-based access: admins can delete students; regular users cannot
- Form validation, loading indicators, and responsive design

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **Authentication:** JSON Web Tokens (JWT)

## Folder Structure

```text
student-management-system/
├── backend/
│   ├── middleware/       # Authentication and authorization
│   ├── models/           # User and student schemas
│   ├── routes/           # Authentication, statistics, and student API routes
│   ├── server.js         # Express application and server entry point
│   └── package.json
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── pages/        # Authentication, dashboard, and student screens
│   │   ├── api.js        # Axios API client
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## How to Run Locally

### Prerequisites

- Node.js and npm
- A MongoDB Atlas cluster (or another MongoDB connection URI)

### 1. Configure the backend

In a terminal, install the backend dependencies and create `backend/.env` with your own values:

```powershell
cd backend
npm install
```

```dotenv
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=replace_with_a_long_random_secret
```

Keep this file private and do not commit real credentials. The root `.gitignore` excludes `.env` files.

Start the backend:

```powershell
npm run dev
```

The API will be available at `http://localhost:5000`.

### 2. Configure and start the frontend

In a second terminal:

```powershell
cd frontend
npm install
```

The frontend defaults to `http://localhost:5000/api`. To use a different API base URL, create `frontend/.env` and set:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

For a deployed API, set `VITE_API_URL` to its API base URL, including `/api`.

Start the Vite development server:

```powershell
npm run dev
```

Open the local URL printed by Vite in your browser.

## Author

[Sadaf Iqbal](https://github.com/sadafiqbal91)
