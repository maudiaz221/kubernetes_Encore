# API Dashboard - Todo API with Encore.ts and Drizzle ORM

A simple REST API built with Encore.ts and Drizzle ORM featuring User management, Authentication, and Todo list functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose
- Encore CLI (install: `curl -L https://encore.dev/install.sh | bash`)

### Setup

1. **Start PostgreSQL database:**
   ```bash
   npm run docker:up
   # or
   docker-compose up -d
   ```

2. **Push database schema:**
   ```bash
   npm run db:push
   ```

3. **Run the application:**
   ```bash
   encore run
   ```

The API will be available at `http://localhost:4000`
Encore dev dashboard at `http://localhost:9400`

## 📁 Project Structure

```
api-dash/
├── src/
│   ├── User/
│   │   ├── model.ts         # User types
│   │   ├── repository.ts    # Database operations
│   │   ├── service.ts       # Business logic
│   │   ├── controller.ts    # API endpoints
│   │   └── encore.service.ts
│   ├── Auth/
│   │   ├── login.ts         # Login endpoint
│   │   ├── signup.ts        # Registration endpoint
│   │   ├── signout.ts       # Signout endpoint
│   │   └── encore.service.ts
│   └── Todo/
│       ├── model.ts         # Todo types
│       ├── repository.ts    # Database operations
│       ├── service.ts       # Business logic
│       ├── controller.ts    # API endpoints
│       └── encore.service.ts
├── database/
│   ├── database.ts          # Drizzle ORM setup
│   ├── schema.ts            # Database schema
│   └── migrations/          # Database migrations
└── docker-compose.yml       # PostgreSQL setup
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login with credentials
- `POST /auth/signout` - Sign out

### Users
- `POST /users` - Create a user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Todos
- `POST /todos` - Create a todo
- `GET /todos/:id` - Get todo by ID
- `GET /todos/user/:userId` - List all todos for a user
- `PUT /todos/:id` - Update todo
- `PATCH /todos/:id/toggle` - Toggle todo completion
- `DELETE /todos/:id` - Delete todo

## 📝 Example Requests

### Sign Up
```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Create Todo
```bash
curl -X POST http://localhost:4000/todos \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }'
```

### List User Todos
```bash
curl http://localhost:4000/todos/user/1
```

## 🛠️ Development

### Database Commands
```bash
# Start database
npm run docker:up

# Stop database
npm run docker:down

# Generate migrations (when schema changes)
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio
```

### Database Connection
The app connects to PostgreSQL using the connection string:
```
postgresql://postgres:postgres@localhost:5432/tododb
```

Configured in `.env` file and `docker-compose.yml`

## 🧪 Testing
```bash
npm test
```

## 📚 Tech Stack
- **Framework:** Encore.ts
- **ORM:** Drizzle ORM
- **Database:** PostgreSQL 15
- **Language:** TypeScript
- **Password Hashing:** bcryptjs

## 🔐 Security Notes
- Passwords are hashed with bcrypt before storage
- In production, implement proper JWT token generation and validation
- Use environment variables for sensitive data
- Add rate limiting and authentication middleware

## 📖 Learn More
- [Encore.ts Documentation](https://encore.dev/docs/ts)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

