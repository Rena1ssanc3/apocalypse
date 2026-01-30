## 1. Frontend Project Initialization

- [x] 1.1 Create `frontend/` directory in project root
- [x] 1.2 Initialize Vite + React + TypeScript project using `npm create vite@latest`
- [x] 1.3 Verify project structure includes `src/`, `public/`, `package.json`, `vite.config.ts`, `tsconfig.json`
- [x] 1.4 Install base dependencies: `npm install`
- [x] 1.5 Test dev server starts successfully with `npm run dev`

## 2. Ant Design Integration

- [x] 2.1 Install Ant Design: `npm install antd`
- [x] 2.2 Configure Ant Design theme in `vite.config.ts` or separate config file
- [x] 2.3 Import Ant Design styles in main entry point
- [x] 2.4 Create a test component using Ant Design Button to verify integration
- [x] 2.5 Verify Ant Design styles render correctly in browser

## 3. React Router Setup

- [x] 3.1 Install React Router: `npm install react-router-dom`
- [x] 3.2 Create `src/routes/` directory for route definitions
- [x] 3.3 Set up BrowserRouter in `src/main.tsx` or `src/App.tsx`
- [x] 3.4 Create basic route structure with placeholder pages (Home, About, etc.)
- [x] 3.5 Test navigation between routes works without page reload

## 4. Base Layout Components

- [x] 4.1 Create `src/components/layout/` directory
- [x] 4.2 Create `MainLayout.tsx` component using Ant Design Layout
- [x] 4.3 Implement Header component with branding and navigation
- [x] 4.4 Implement Sidebar component with collapsible menu using Ant Design Menu
- [x] 4.5 Implement Content area with proper padding and scroll behavior
- [x] 4.6 Add responsive behavior for mobile/tablet/desktop viewports
- [x] 4.7 Test layout renders correctly and sidebar collapse/expand works

## 5. Backend API Integration

- [x] 5.1 Install Axios: `npm install axios`
- [x] 5.2 Create `src/services/` directory for API services
- [x] 5.3 Create `api.ts` with configured Axios instance (base URL: `/api`)
- [x] 5.4 Implement request interceptor for adding common headers
- [x] 5.5 Implement response interceptor for error handling
- [x] 5.6 Create example API service file (e.g., `userService.ts`) to demonstrate pattern

## 6. User Authentication

- [x] 6.1 Create `src/pages/Login/` directory for login page
- [x] 6.2 Implement Login page component using Ant Design Form
- [x] 6.3 Add form validation for username and password fields
- [x] 6.4 Create authentication context using React Context API
- [x] 6.5 Implement login API call in authentication service

## 7. Authentication State Management

- [x] 7.1 Create auth context provider with login/logout functions
- [x] 7.2 Implement token storage in localStorage
- [x] 7.3 Add token retrieval and validation on app initialization
- [x] 7.4 Update Axios interceptor to include auth token in requests
- [x] 7.5 Implement logout functionality with token cleanup

## 8. Protected Routes

- [x] 8.1 Create ProtectedRoute component wrapper
- [x] 8.2 Implement redirect to login for unauthenticated users
- [x] 8.3 Wrap protected routes with ProtectedRoute component
- [x] 8.4 Handle token expiration with automatic logout
- [x] 8.5 Test authentication flow: login, access protected routes, logout

## 9. Development Proxy Configuration

- [x] 9.1 Configure Vite proxy in `vite.config.ts` to forward `/api` to `http://localhost:8080`
- [x] 9.2 Add `changeOrigin: true` to proxy configuration
- [x] 9.3 Test proxy works by making API call from frontend to backend
- [x] 9.4 Verify no CORS errors in browser console during development

## 10. Maven Build Integration

- [x] 10.1 Add `frontend-maven-plugin` to `pom.xml`
- [x] 10.2 Configure plugin to install Node.js and npm during build
- [x] 10.3 Configure plugin to run `npm install` during Maven build
- [x] 10.4 Configure plugin to run `npm run build` during Maven build
- [x] 10.5 Add `maven-resources-plugin` to copy `frontend/dist/` to `target/classes/static/`
- [x] 10.6 Test `mvn clean package` builds both frontend and backend successfully
- [x] 10.7 Verify built JAR contains frontend static files in `BOOT-INF/classes/static/`

## 11. Spring Boot Configuration for SPA

- [x] 11.1 Create or update Spring Boot configuration class for SPA routing
- [x] 11.2 Add controller to forward non-API routes to `index.html`
- [x] 11.3 Ensure all backend API endpoints are prefixed with `/api`
- [x] 11.4 Test that frontend routes work correctly when accessing directly (e.g., `/about`)

## 12. TypeScript Configuration

- [x] 12.1 Review and update `tsconfig.json` with strict mode enabled
- [x] 12.2 Configure path aliases if needed (e.g., `@/components`)
- [x] 12.3 Ensure TypeScript compilation has no errors
- [x] 12.4 Add type definitions for API responses

## 13. Testing and Verification

- [x] 13.1 Test development workflow: start backend, start frontend, verify communication
- [x] 13.2 Test authentication flow: login, access protected routes, logout
- [x] 13.3 Test production build: run `mvn clean package`, start JAR, verify frontend loads
- [x] 13.4 Verify all routes work in production mode
- [x] 13.5 Test API calls work correctly from frontend to backend
- [x] 13.6 Verify layout components render correctly on different screen sizes
- [x] 13.7 Check browser console for any errors or warnings

## 14. Documentation and Cleanup

- [x] 14.1 Add `.gitignore` entries for `frontend/node_modules/` and `frontend/dist/`
- [x] 14.2 Document development setup in README (how to run frontend and backend)
- [x] 14.3 Document authentication flow and login credentials
- [x] 14.4 Document production build process (`mvn clean package`)
- [x] 14.5 Clean up any unused boilerplate code from Vite template

