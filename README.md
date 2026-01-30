# Apocalypse - Spring Boot + React Application

A full-stack web application built with Spring Boot backend and React + Ant Design frontend.

## Project Structure

```
apocalypse/
├── src/main/java/          # Spring Boot backend
│   └── com/example/demo/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── services/       # API services
│   └── package.json
└── pom.xml                 # Maven configuration
```

## Technology Stack

### Backend
- Java 21
- Spring Boot 3.4.1
- Maven

### Frontend
- React 19.2.0
- TypeScript
- Vite 7.x
- Ant Design 6.2.0
- React Router
- Axios

## Getting Started

### Prerequisites
- Java 21 or higher
- Maven (or use included Maven wrapper)
- Node.js 20.19+ (for local development)

### Development Mode

1. **Start the backend**:
   ```bash
   ./mvnw spring-boot:run
   ```
   Backend will run on http://localhost:8080

2. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Frontend will run on http://localhost:5173

The frontend dev server is configured to proxy API requests to the backend.

### Production Build

Build the complete application (frontend + backend) into a single JAR:

```bash
./mvnw clean package
```

Run the production JAR:

```bash
java -jar target/apocalypse-0.0.1-SNAPSHOT.jar
```

Access the application at http://localhost:8080

## Features

- **Authentication System**: Login page with JWT token-based authentication
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Responsive Layout**: Collapsible sidebar navigation using Ant Design
- **API Integration**: Axios-based HTTP client with request/response interceptors
- **Single JAR Deployment**: Frontend and backend packaged together

## API Endpoints

All backend API endpoints are prefixed with `/api`:

- `GET /api/hello` - Test endpoint
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

## Authentication

The application uses token-based authentication:

1. Navigate to `/login`
2. Enter credentials
3. On successful login, token is stored in localStorage
4. Token is automatically included in all API requests
5. Use the logout button to clear the session

## Build Configuration

The project uses Maven's frontend-maven-plugin to:
- Install Node.js and npm during build
- Run `npm install` to install dependencies
- Run `npm run build` to build the frontend
- Copy built files to `target/classes/static/`

This ensures a single `mvn package` command builds both frontend and backend.
