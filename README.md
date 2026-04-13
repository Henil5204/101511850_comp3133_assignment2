# EmpTrack — COMP3133 Assignment 2

**Student ID:** 101511850  
**Course:** COMP 3133 — Full Stack Development II  
**Institution:** George Brown College  
**Submitted:** April 2026

---

## Live Demo

| Service | URL |
|---|---|
| Frontend | https://101511850-comp3133-assignment2.vercel.app/login|
| Backend API | https://one01511850-comp3133-assignment2.onrender.com/graphql |
| GitHub | https://github.com/Henil5204/101511850_comp3133_assignment2.git |

---

## Overview

EmpTrack is a full-stack Employee Management System. It allows administrators to log in, manage employees (add, view, edit, delete), and search employees by department or designation — all powered by a GraphQL API.

---

## Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| Angular 17 | Core framework (standalone components) |
| Angular Material | Table, Paginator, Sort, Snackbar |
| Bootstrap 5 | Grid and utility classes |
| Axios | HTTP client for GraphQL requests |
| Angular Signals | Reactive state management |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express | HTTP server |
| Apollo Server | GraphQL server |
| MongoDB + Mongoose | Database and ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Docker + Docker Compose | Containerization |

---

## Project Structure

```
101511850_comp3133_assignment2/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── entrypoint.sh
│   ├── server.js
│   ├── seed.js
│   ├── package.json
│   ├── .env.example
│   ├── models/
│   │   ├── User.js
│   │   └── Employee.js
│   └── graphql/
│       ├── typeDefs.js
│       └── resolvers.js
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── angular.json
    ├── package.json
    └── src/
        └── app/
            ├── components/
            │   ├── navbar/
            │   ├── login/
            │   ├── signup/
            │   ├── employee-list/
            │   ├── employee-add/
            │   ├── employee-edit/
            │   └── employee-view/
            ├── services/
            │   ├── auth.service.ts
            │   └── graphql.service.ts
            ├── guards/
            │   └── auth.guard.ts
            ├── pipes/
            │   ├── initials.pipe.ts
            │   └── salary-format.pipe.ts
            └── directives/
                ├── highlight.directive.ts
                └── tooltip.directive.ts
```

---

## Features

| # | Feature | Details |
|---|---|---|
| 1 | User Signup | Reactive form with validation, JWT returned |
| 2 | User Login | Username + password, JWT stored in localStorage |
| 3 | Logout | Clears session, redirects to login |
| 4 | Employee List | Sortable, paginated Material table with stats |
| 5 | Add Employee | Two-step form with photo upload (file or URL) |
| 6 | View Employee | Full profile with salary breakdown and tenure |
| 7 | Edit Employee | Pre-filled form with all validations |
| 8 | Delete Employee | Confirmation modal, permanent deletion |
| 9 | Search by Department | GraphQL query — real-time filter |
| 10 | Search by Designation | GraphQL query — real-time filter |

---

## Angular Concepts Used

| Concept | Implementation |
|---|---|
| **Components** | Login, Signup, Navbar, EmployeeList, EmployeeAdd, EmployeeEdit, EmployeeView |
| **Services** | `GraphqlService` (Axios + GraphQL), `AuthService` (JWT via DI) |
| **Pipes** | `InitialsPipe`, `SalaryFormatPipe` (custom standalone pipes) |
| **Directives** | `HighlightDirective`, `TooltipDirective` (custom attribute directives) |
| **Routing** | Lazy-loaded routes, `CanActivate` guards |
| **Reactive Forms** | `FormBuilder`, `Validators`, cross-field password match validator |
| **Angular Signals** | `signal()`, `computed()` for reactive state |
| **Angular Material** | `MatTable`, `MatPaginator`, `MatSort`, `MatSnackBar` |
| **Bootstrap** | Grid and utility classes |

---

## GraphQL API Reference

### Queries
```graphql
# Get all employees
getAllEmployees: [Employee!]!

# Search by ID
searchEmployeeById(eid: ID!): Employee

# Search by designation
searchEmployeeByDesignation(designation: String!): [Employee!]!

# Search by department
searchEmployeeByDepartment(department: String!): [Employee!]!
```

### Mutations
```graphql
# Auth
signup(username: String!, email: String!, password: String!): AuthPayload!
login(username: String!, password: String!): AuthPayload!

# Employee CRUD
addEmployee(first_name, last_name, email, gender, designation, department, salary, date_of_joining, employee_photo): Employee!
updateEmployee(eid: ID!, ...fields): Employee!
deleteEmployee(eid: ID!): DeleteResponse!
```

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Angular CLI: `npm install -g @angular/cli`

### Option 1 — Docker (Recommended)

```bash
# Clone the repo
git clone https://github.com/Henil5204/101511850_comp3133_assignment2.git
cd 101511850_comp3133_assignment2

# Start everything
docker-compose up --build

# Open browser
# http://localhost:4200
```

### Option 2 — Without Docker

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
node seed.js
npm start
# API running at http://localhost:4000/graphql
```

**Frontend:**
```bash
cd frontend
npm install --legacy-peer-deps
npm start
# App running at http://localhost:4200
```

---

## Default Login Credentials

```
Username: admin       Password: Admin123!
Username: manager     Password: Manager123!
```

---

## Environment Variables

Create `backend/.env`:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/comp3133_assignment2
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
```

---

## Cloud Deployment

### Backend → Render.com
1. Go to [render.com](https://render.com) → New Web Service
2. Connect GitHub repo, set root directory to `backend`
3. Build: `npm install` · Start: `node server.js`
4. Add environment variables: `MONGODB_URI`, `JWT_SECRET`

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Connect GitHub repo, set root directory to `frontend`
3. Build command: `npm run build`
4. Output directory: `dist/frontend/browser`

### Database → MongoDB Atlas
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Free cluster
2. Get connection string → use as `MONGODB_URI`

---

## Screenshots

> Add screenshots here for D2L submission

1. Login screen
2. Signup screen
3. Employee list with search
4. Add employee (Step 1 — Personal info)
5. Add employee (Step 2 — Work details)
6. Employee profile view
7. Edit employee
8. Delete confirmation
9. Search by department results
10. Search by designation results
11. MongoDB Compass data
12. Postman GraphQL tests

---

*COMP 3133 · Full Stack Development II · George Brown College · 2026*