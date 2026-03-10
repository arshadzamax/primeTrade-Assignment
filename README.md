# PrimeTrade.ai — Scalable REST API with Authentication & RBAC

A production-grade, backend-focused REST API built with **Node.js**, **Express**, and **MongoDB**, featuring JWT authentication with refresh token rotation, role-based access control, and a **React** frontend styled with **Tailwind CSS v4** in a **neobrutalism** design system.

---

## Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [Role-Based Access Control](#role-based-access-control)
- [Error Handling](#error-handling)
- [Security Measures](#security-measures)
- [Scalability Notes](#scalability-notes)
- [Docker Deployment](#docker-deployment)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   CLIENT (React)                │
│   Vite + Tailwind CSS v4 + Neobrutalism UI      │
│   Auth Pages │ Dashboard │ Admin Panel │ Toasts  │
└──────────────────────┬──────────────────────────┘
                       │ HTTP (Axios + Interceptors)
┌──────────────────────▼──────────────────────────┐
│              API GATEWAY (Express.js)           │
│  Helmet │ CORS │ Rate Limiter │ Morgan/Winston  │
├─────────────────────────────────────────────────┤
│              /api/v1 Router                     │
│  /auth  │  /users (admin)  │  /tasks            │
├─────────────────────────────────────────────────┤
│  Middleware Stack                               │
│  JWT Auth │ RBAC │ Validation │ Error Handler   │
├─────────────────────────────────────────────────┤
│  Controller Layer        (thin, delegates)      │
├─────────────────────────────────────────────────┤
│  Service Layer           (business logic)       │
├─────────────────────────────────────────────────┤
│  Data Access Layer       (Mongoose ODM)         │
├─────────────────────────────────────────────────┤
│  MongoDB                 (Database)             │
└─────────────────────────────────────────────────┘
```

The architecture uses a **layered pattern** — controllers are thin and delegate to services, which contain all business logic. This makes the codebase testable, maintainable, and easy to extend with new modules.

---

## Tech Stack

### Backend
| Layer           | Technology                  |
|----------------|-----------------------------|
| Runtime        | Node.js 20+                 |
| Framework      | Express.js                  |
| Database       | MongoDB + Mongoose ODM      |
| Authentication | JWT (access + refresh)      |
| Hashing        | bcrypt (12 salt rounds)     |
| Validation     | express-validator           |
| Documentation  | swagger-jsdoc + swagger-ui  |
| Security       | helmet, cors, rate-limit, mongo-sanitize |
| Logging        | Winston + Morgan            |

### Frontend
| Layer     | Technology              |
|----------|--------------------------|
| Framework | React 19 (Vite)         |
| Styling   | Tailwind CSS v4 (CSS-first) |
| Design    | Neobrutalism             |
| HTTP      | Axios (interceptors + token refresh) |
| Routing   | React Router v7          |
| State     | Context API + useReducer |
| Toasts    | react-hot-toast          |

---

## Features

### Backend
- ✅ User registration & login with bcrypt password hashing
- ✅ JWT authentication with access + refresh token rotation
- ✅ Role-based access control (user vs admin)
- ✅ Full CRUD for tasks (create, read, update, delete)
- ✅ Pagination, filtering, sorting, and text search on tasks
- ✅ API versioning (`/api/v1/`)
- ✅ Input validation with express-validator
- ✅ Centralized error handling with custom `ApiError` class
- ✅ Swagger/OpenAPI documentation at `/api-docs`
- ✅ MongoDB data sanitization (NoSQL injection prevention)
- ✅ Rate limiting, Helmet security headers, CORS
- ✅ Structured logging with Winston (file + console transports)
- ✅ Graceful shutdown handling
- ✅ Docker deployment ready

### Frontend
- ✅ Register & login with client-side + server-side validation
- ✅ Protected routes with JWT (access token in localStorage)
- ✅ Automatic token refresh via Axios interceptors
- ✅ Task dashboard with create, edit, delete modals
- ✅ Search, filter by status/priority, pagination
- ✅ Admin panel for user management and system-wide task view
- ✅ Neobrutalism design with micro-animations
- ✅ Responsive layout (mobile-friendly)
- ✅ Toast notifications for all API responses

---

## Project Structure

```
primetrade.ai/
├── server/
│   ├── src/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── controllers/       # Thin request handlers
│   │   │       │   ├── auth.controller.js
│   │   │       │   ├── task.controller.js
│   │   │       │   └── user.controller.js
│   │   │       ├── middlewares/        # Auth, RBAC, validation, error
│   │   │       │   ├── auth.middleware.js
│   │   │       │   ├── rbac.middleware.js
│   │   │       │   ├── validate.middleware.js
│   │   │       │   └── errorHandler.middleware.js
│   │   │       ├── routes/             # Route definitions + Swagger
│   │   │       │   ├── auth.routes.js
│   │   │       │   ├── task.routes.js
│   │   │       │   ├── user.routes.js
│   │   │       │   └── index.js
│   │   │       └── validators/         # express-validator chains
│   │   │           ├── auth.validator.js
│   │   │           └── task.validator.js
│   │   ├── config/
│   │   │   ├── db.js                   # MongoDB connection
│   │   │   ├── env.js                  # Env validation
│   │   │   └── swagger.js              # OpenAPI spec
│   │   ├── models/
│   │   │   ├── User.model.js           # User schema
│   │   │   └── Task.model.js           # Task schema
│   │   ├── services/                   # Business logic layer
│   │   │   ├── auth.service.js
│   │   │   ├── task.service.js
│   │   │   └── user.service.js
│   │   ├── utils/
│   │   │   ├── ApiError.js             # Custom error class
│   │   │   ├── ApiResponse.js          # Response wrapper
│   │   │   ├── asyncHandler.js         # Async error catcher
│   │   │   ├── constants.js            # Enums & defaults
│   │   │   └── logger.js               # Winston config
│   │   └── app.js                      # Express app setup
│   ├── server.js                       # Entry point
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
├── client/                             # React + Vite frontend
│   ├── src/
│   │   ├── api/                        # Axios + API methods
│   │   ├── components/                 # Reusable UI components
│   │   ├── context/                    # Auth context
│   │   ├── pages/                      # Page components
│   │   ├── index.css                   # Tailwind v4 design system
│   │   └── App.jsx                     # Root with routing
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js** 20+ and npm
- **MongoDB** (local instance or MongoDB Atlas)
- **Git**

### 1. Clone the repository
```bash
git clone https://github.com/arshadzamax/primeTrade-Assignment.git
cd primeTrade-Assignment
```

### 2. Backend setup
```bash
cd server
cp .env.example .env          # Edit .env with your MongoDB URI and secrets
npm install
npm run dev                   # Starts on http://localhost:5000
```

### 3. Frontend setup
```bash
cd client
npm install
npm run dev                   # Starts on http://localhost:5173
```

### 4. Verify
- **API Health**: http://localhost:5000/health
- **Swagger Docs**: http://localhost:5000/api-docs
- **Frontend**: http://localhost:5173

---

## API Documentation

Interactive Swagger documentation is available at:

```
http://localhost:5000/api-docs
```

It includes:
- All endpoints with request/response schemas
- Authentication via "Authorize" button (paste JWT)
- Try-it-out functionality for testing directly

---

## API Endpoints

### Auth (`/api/v1/auth`)
| Method | Endpoint    | Access | Description           |
|--------|------------|--------|-----------------------|
| POST   | /register  | Public | Register a new user   |
| POST   | /login     | Public | Login, returns JWT pair |
| POST   | /refresh   | Public | Refresh access token  |
| GET    | /me        | Auth   | Get current user info |

### Tasks (`/api/v1/tasks`)
| Method | Endpoint | Access | Description                     |
|--------|---------|--------|---------------------------------|
| GET    | /       | Auth   | List own tasks (paginated)       |
| POST   | /       | Auth   | Create a new task               |
| GET    | /all    | Admin  | List ALL tasks in system        |
| GET    | /:id    | Auth   | Get task by ID (ownership check) |
| PUT    | /:id    | Auth   | Update own task                 |
| DELETE | /:id    | Auth   | Delete own task (admin can delete any) |

### Users (`/api/v1/users`) — Admin Only
| Method | Endpoint | Access | Description                      |
|--------|---------|--------|----------------------------------|
| GET    | /       | Admin  | List all users (paginated)       |
| DELETE | /:id    | Admin  | Delete user + cascade tasks      |

### Query Parameters (Tasks)
| Param    | Type    | Description                                      |
|----------|---------|--------------------------------------------------|
| page     | int     | Page number (default: 1)                         |
| limit    | int     | Items per page (default: 10, max: 100)           |
| status   | string  | Filter: `todo`, `in_progress`, `done`            |
| priority | string  | Filter: `low`, `medium`, `high`                  |
| sortBy   | string  | Sort field: `createdAt`, `dueDate`, `priority`   |
| order    | string  | Sort order: `asc` or `desc`                      |
| search   | string  | Text search on task title                        |

---

## Database Schema

### User
```javascript
{
  name:         String,     // required, max 60 chars
  email:        String,     // required, unique, indexed
  password:     String,     // bcrypt hashed, never returned in queries
  role:         String,     // "user" | "admin" (default: "user")
  refreshToken: String,     // stored for token rotation
  createdAt:    Date,
  updatedAt:    Date
}
```

### Task
```javascript
{
  title:       String,      // required, max 120 chars
  description: String,      // optional, max 1000 chars
  status:      String,      // "todo" | "in_progress" | "done"
  priority:    String,      // "low" | "medium" | "high"
  dueDate:     Date,        // optional
  owner:       ObjectId,    // ref: User, indexed
  createdAt:   Date,
  updatedAt:   Date
}

// Compound indexes:
// { owner: 1, status: 1 }
// { owner: 1, createdAt: -1 }
// { owner: 1, priority: 1 }
```

---

## Authentication Flow

```
1. Register/Login → Server returns { accessToken, refreshToken }
2. Client stores both tokens in localStorage
3. Every API call → Axios interceptor attaches Bearer token
4. If 401 (expired) → Interceptor auto-calls /auth/refresh
5. New tokens issued → Old refresh token invalidated (rotation)
6. All queued failed requests are retried with new token
7. If refresh fails → User is logged out
```

**Key security decisions:**
- Access tokens are short-lived (15 min default)
- Refresh tokens are long-lived (7 days) and stored server-side for validation
- Token rotation ensures stolen refresh tokens become invalid after one use

---

## Role-Based Access Control

| Resource          | User | Admin |
|-------------------|------|-------|
| Register/Login    | ✅   | ✅    |
| View own tasks    | ✅   | ✅    |
| CRUD own tasks    | ✅   | ✅    |
| View ALL tasks    | ❌   | ✅    |
| Delete any task   | ❌   | ✅    |
| List all users    | ❌   | ✅    |
| Delete users      | ❌   | ✅    |

Implementation: `authorize("admin")` middleware factory checks `req.user.role`.

---

## Error Handling

All errors follow a consistent JSON format:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email",
      "value": "invalid"
    }
  ]
}
```

The global error handler (`errorHandler.middleware.js`) handles:
- Custom `ApiError` instances
- Mongoose `CastError` (invalid ObjectId)
- Mongoose duplicate key errors (code 11000)
- Mongoose `ValidationError`
- Unhandled errors (wrapped as 500)

Stack traces are only included in development (`NODE_ENV=development`).

---

## Security Measures

| Measure                     | Implementation                                   |
|-----------------------------|--------------------------------------------------|
| Password hashing            | bcrypt with 12 salt rounds                       |
| JWT authentication          | Short-lived access + refresh token rotation      |
| Input validation            | express-validator on all routes                  |
| NoSQL injection prevention  | express-mongo-sanitize strips `$` and `.` from input |
| HTTP security headers       | Helmet (CSP, HSTS, X-Frame, etc.)                |
| CORS                        | Whitelist-based origin policy                    |
| Rate limiting               | 100 requests per 15 min window per IP            |
| Body size limiting          | 10kb max request body                            |
| Password selection rules    | Min 8 chars, 1 uppercase, 1 number               |
| Sensitive field redaction    | Password and refreshToken stripped from JSON      |

---

## Scalability Notes

This codebase is designed for horizontal scalability. Here's how to evolve it for production:

### Current Architecture Supports
- **Stateless API**: JWT-based auth means any server instance can handle any request — ready for load balancing
- **Modular structure**: Adding a new entity (e.g., "Projects") means adding a new model, service, controller, and route — no core changes needed
- **API versioning**: `/api/v1/` prefix allows introducing `/api/v2/` without breaking existing clients

### Production Recommendations

#### Caching (Redis)
```
Client → API → Redis Cache → MongoDB
```
- Cache frequently read data (user profiles, task lists)
- Implement cache invalidation on write operations
- Use Redis for session/refresh token storage instead of MongoDB

#### Load Balancing
```
Client → Nginx/ALB → [API-1, API-2, API-3] → MongoDB Replica Set
```
- Use Nginx or AWS ALB to distribute traffic
- Since JWT is stateless, no sticky sessions needed
- MongoDB replica set for read scaling

#### Microservices Migration Path
```
API Gateway → Auth Service
            → Task Service
            → User Service
            → Notification Service
```
- Services are already separated (auth.service, task.service, user.service)
- Each can be extracted into its own deployable unit
- Use message queues (RabbitMQ/Kafka) for inter-service communication

#### Monitoring & Observability
- Winston logs → ELK Stack (Elasticsearch, Logstash, Kibana)
- APM: Datadog, New Relic, or OpenTelemetry
- Health endpoint (`/health`) for container orchestration probes

---

## Docker Deployment

```bash
# Start MongoDB + API server
docker-compose up -d

# Check containers
docker-compose ps

# View logs
docker-compose logs -f server

# Stop
docker-compose down
```

The API will be available at `http://localhost:5000`.

---