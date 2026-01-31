# Task Management System (MERN Stack)

A full-stack task management application with authentication, project management, and task tracking.

## Features

- **Authentication**: Secure Login and Registration using JWT and HTTP-only cookies (or local storage for this demo).
- **Dashboard**: Overview of project and task statistics.
- **Projects**: Create and manage projects.
- **Tasks**: Add tasks to projects with priorities (High, Medium, Low) and statuses (Todo, In Progress, Done).
- **UI/UX**: Modern, responsive design using Tailwind CSS and Framer Motion.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.

## Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB installed and running locally, or a MongoDB Atlas URI.

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and configure your MongoDB URI:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
   JWT_SECRET=08d3e5cadd628bdaa1566cff894838b3144c2c5907b717709d11aa2ead22077f5a51d7e19efceafadf7e6bbcdb0db7096cffbd46a984e788fc31674bd4a20d9f
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Usage
- Open your browser at `http://localhost:5173`.
- Register a new account.
- Create a project.
- Click "View Tasks" on a project card to manage tasks.

## API Endpoints

### Auth
- `POST /api/users`: Register a new user
- `POST /api/users/login`: Login user
- `GET /api/users/me`: Get current user profile
- `PUT /api/users/profile`: Update user profile

### Projects
- `GET /api/projects`: Get all projects for current user
- `POST /api/projects`: Create a new project
- `GET /api/projects/:id`: Get single project details
- `PUT /api/projects/:id`: Update a project
- `DELETE /api/projects/:id`: Delete a project

### Tasks
- `POST /api/tasks`: Create a new task
- `GET /api/tasks/project/:projectId`: Get all tasks for a project
- `PUT /api/tasks/:id`: Update a task (status, etc.)
- `DELETE /api/tasks/:id`: Delete a task

### Dashboard
- `GET /api/dashboard/stats`: Get dashboard statistics

