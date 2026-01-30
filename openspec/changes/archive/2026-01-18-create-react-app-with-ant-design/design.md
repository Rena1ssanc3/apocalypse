## Context

This design adds a React + TypeScript frontend to an existing Spring Boot backend project. The current project has a Spring Boot REST API but no frontend UI. This design establishes a modern, maintainable frontend architecture using Ant Design components that integrates seamlessly with the existing backend.

**Current State:**
- Spring Boot backend with REST API endpoints
- No frontend UI layer
- Backend likely runs on port 8080 (standard Spring Boot)

**Constraints:**
- Must integrate with existing Spring Boot project structure
- Need to support both development (separate frontend/backend servers) and production (bundled deployment)
- Should follow React and TypeScript best practices

## Goals / Non-Goals

**Goals:**
- Create a production-ready React + TypeScript frontend with Ant Design
- Establish clear separation between frontend and backend code
- Enable efficient local development with hot reload
- Support production deployment where Spring Boot serves the built frontend
- Provide reusable component architecture and API integration patterns

**Non-Goals:**
- Migrating or modifying existing backend code (except CORS/static serving config)
- Server-side rendering (SSR) or Next.js - this is a client-side SPA
- Mobile app development - web only
- Implementing specific business features (this is foundation only)

## Decisions

### 1. Build Tool: Vite vs Create React App

**Decision:** Use **Vite**

**Rationale:**
- Significantly faster dev server startup and HMR than CRA
- Better TypeScript support out of the box
- Modern build tool with active development
- CRA is in maintenance mode

**Alternatives Considered:**
- Create React App: Slower, less maintained, but more familiar to some developers
- Custom Webpack: Too much configuration overhead for this use case

### 2. Project Structure: Monorepo vs Separate Directory

**Decision:** Use **separate `frontend/` directory** within the Spring Boot project root

**Rationale:**
- Clear separation of concerns between frontend and backend
- Independent dependency management (package.json vs pom.xml/build.gradle)
- Easier to run frontend and backend separately during development
- Standard pattern for Spring Boot + React projects

**Structure:**
```
project-root/
├── src/                    # Spring Boot backend source
├── frontend/               # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── pom.xml / build.gradle  # Backend build config
└── README.md
```

**Alternatives Considered:**
- Monorepo with Nx/Turborepo: Overkill for a single frontend + backend
- Frontend as separate repository: Adds complexity for deployment and versioning

### 3. API Communication: Axios vs Fetch

**Decision:** Use **Axios**

**Rationale:**
- Automatic JSON transformation
- Better error handling and interceptors for auth tokens
- Request/response interceptors for logging and error handling
- Timeout support built-in
- Better TypeScript support for request/response types

**Alternatives Considered:**
- Native Fetch API: Simpler, no dependencies, but requires more boilerplate
- React Query with Fetch: Good for caching, but Axios still better for base HTTP client

### 4. Development Proxy Configuration

**Decision:** Use **Vite's proxy configuration** to forward API requests to Spring Boot during development

**Rationale:**
- Avoids CORS issues during local development
- Frontend runs on port 5173 (Vite default), backend on 8080
- Proxy `/api/*` requests to `http://localhost:8080`
- Simpler than configuring CORS for development

**Configuration in `vite.config.ts`:**
```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

**Alternatives Considered:**
- CORS configuration only: Works but requires backend changes for dev environment
- Running everything on same port: Complicates development workflow

### 5. Production Deployment Strategy

**Decision:** Build frontend to `src/main/resources/static` and serve via Spring Boot

**Rationale:**
- Single deployable JAR/WAR file containing both frontend and backend
- Spring Boot automatically serves static files from `static/` directory
- Simplifies deployment - no separate web server needed
- Standard pattern for Spring Boot SPAs

**Build Integration:**
- Frontend build outputs to `frontend/dist`
- Maven/Gradle plugin copies `dist/` to `src/main/resources/static` during build
- Spring Boot serves index.html for all non-API routes (SPA routing support)

**Alternatives Considered:**
- Separate Nginx server: More complex deployment, better for high-traffic scenarios
- CDN hosting: Requires separate deployment pipeline and CORS configuration

### 6. State Management

**Decision:** Start with **React Context API** for global state, add Redux/Zustand only if needed

**Rationale:**
- Context API sufficient for basic global state (user auth, theme)
- Avoid premature complexity
- Can migrate to Redux/Zustand later if state management becomes complex
- Ant Design components have built-in state management

**Alternatives Considered:**
- Redux Toolkit: Powerful but overkill for initial setup
- Zustand: Lightweight alternative, good middle ground if Context becomes insufficient

## Risks / Trade-offs

### [Risk] Frontend and backend version coupling
**Mitigation:** Use API versioning (e.g., `/api/v1/`) to allow independent evolution. Document breaking changes clearly.

### [Risk] Large bundle size with Ant Design
**Mitigation:** Vite's tree-shaking automatically removes unused components. Monitor bundle size with `vite-plugin-bundle-analyzer`.

### [Risk] CORS issues in production if API and frontend on different domains
**Mitigation:** Deploy as single artifact (frontend served by Spring Boot). If separate deployment needed later, configure CORS properly in Spring Boot.

### [Risk] SPA routing conflicts with Spring Boot endpoints
**Mitigation:** Prefix all backend APIs with `/api`. Configure Spring Boot to forward non-API routes to `index.html` for client-side routing.

### [Trade-off] Single JAR deployment vs separate services
- **Pro:** Simpler deployment, single artifact
- **Con:** Can't scale frontend and backend independently
- **Decision:** Start with single JAR, split later if scaling needs arise

## Migration Plan

### Development Setup
1. Create `frontend/` directory in project root
2. Initialize Vite + React + TypeScript project
3. Install Ant Design and React Router dependencies
4. Configure Vite proxy to point to Spring Boot backend
5. Developers run both servers locally: `npm run dev` (frontend) and Spring Boot app (backend)

### Production Build Integration
1. Add frontend build step to Maven/Gradle build process
2. Configure frontend build output to copy to `src/main/resources/static`
3. Add Spring Boot configuration to serve `index.html` for non-API routes
4. Test full build produces single JAR with embedded frontend

### Rollback Strategy
- Frontend changes are bundled with backend, so rollback is standard JAR/WAR rollback
- If frontend breaks, can temporarily disable by removing static files and deploying backend-only
- Keep frontend and backend changes in sync to avoid API compatibility issues

## Open Questions

1. **Build tool preference**: Does the project use Maven or Gradle? (Affects build integration steps)
2. **API endpoint structure**: Are backend APIs already prefixed with `/api`? If not, should we add this prefix?
3. **Authentication**: Does the backend have authentication? If so, what mechanism (JWT, session-based)?
4. **Existing CORS configuration**: Is CORS already configured in Spring Boot? May need adjustment for development.

