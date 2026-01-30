## Context

The application is a Spring Boot + React application with:
- **Backend**: Java 21, Spring Boot 3.4.1, Spring Data JPA, H2/MySQL database
- **Frontend**: React 19, TypeScript, Ant Design 6.2.0, Vite
- **Auth**: Custom token-based authentication (UUID tokens, BCrypt passwords)
- **Current User Model**: Basic entity with `id`, `username`, `password` fields only

The existing User entity lacks fields needed for user management (email, enabled status, timestamps). The application has no admin interface for managing users - currently only login/logout functionality exists.

## Goals / Non-Goals

**Goals:**
- Add comprehensive user management UI accessible to administrators
- Extend User entity with email, enabled status, and audit timestamps
- Implement REST API endpoints for user CRUD operations
- Follow existing architectural patterns (controller/service/repository, DTOs, Ant Design components)
- Maintain backward compatibility with existing authentication flow

**Non-Goals:**
- Role-based access control (RBAC) system - assume single admin role for now
- User self-registration or password reset flows
- Email verification or notification system
- User profile editing by non-admin users
- Pagination for user list (can be added later if needed)

## Decisions

### 1. Database Schema Extension

**Decision**: Add new fields to existing `users` table via Flyway migration

**Rationale**:
- Existing User entity is minimal and needs enhancement
- Flyway migration ensures version-controlled schema changes
- Adding fields is non-breaking (existing auth flow only uses username/password)

**Schema Changes** (new migration `V2__add_user_management_fields.sql`):
```sql
ALTER TABLE users
ADD COLUMN email VARCHAR(255),
ADD COLUMN enabled BOOLEAN DEFAULT TRUE NOT NULL,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL;

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_enabled ON users(enabled);
```

**Alternatives Considered**:
- Create separate `user_profiles` table → Rejected: Over-engineering for simple fields
- Use soft delete flag → Rejected: `enabled` field serves similar purpose without data loss concerns

---

### 2. API Endpoint Design

**Decision**: Create new `/api/users` controller with RESTful endpoints

**Endpoints**:
- `GET /api/users` - List all users (returns UserDTO array)
- `POST /api/users` - Create new user (accepts CreateUserRequest)
- `PATCH /api/users/{id}/status` - Enable/disable user (accepts UpdateUserStatusRequest)
- `GET /api/users/{id}` - Get single user details (optional, for future use)

**Rationale**:
- Follows existing `/api/*` pattern
- RESTful design aligns with Spring Boot conventions
- Separate status endpoint makes enable/disable explicit and auditable
- Uses DTOs to avoid exposing password hashes

**Alternatives Considered**:
- `PUT /api/users/{id}` for full updates → Rejected: Not needed for MVP, only status toggle required
- Include status in user list endpoint → Accepted: Status is essential for management UI
- `DELETE /api/users/{id}` → Rejected: Soft disable via `enabled` flag is safer

---

### 3. Authorization Strategy

**Decision**: Add simple admin check in controller methods

**Implementation**:
- Check if authenticated user's username is "admin" (hardcoded for MVP)
- Return 403 Forbidden if non-admin attempts user management operations
- Reuse existing token-based auth mechanism

**Rationale**:
- Minimal change to existing auth system
- Sufficient for single-admin use case
- Can be refactored to proper RBAC later without API changes

**Alternatives Considered**:
- Implement full RBAC with roles table → Rejected: Out of scope, over-engineering
- Use Spring Security annotations (@PreAuthorize) → Rejected: Spring Security is disabled in config
- No authorization → Rejected: Security risk, any authenticated user could manage others

---

### 4. Frontend Architecture

**Decision**: Create new "Users" page in `frontend/src/pages/Users/`

**Components**:
- `Users/index.tsx` - Main page with user table and actions
- `Users/CreateUserModal.tsx` - Modal form for creating users
- `services/userService.ts` - API client for user endpoints
- Update `types/api.ts` with new interfaces

**UI Layout**:
- Ant Design `Table` component for user list
- Columns: Username, Email, Status (Tag), Created At, Actions
- "Add User" button above table
- Enable/Disable toggle in Actions column (Switch component)
- Modal form for user creation with validation

**Rationale**:
- Follows existing page structure pattern (Login/, Home/, About/)
- Ant Design Table provides sorting, filtering out of the box
- Modal form keeps UI clean and focused
- Switch component provides intuitive enable/disable UX

**Alternatives Considered**:
- Inline editing in table → Rejected: More complex, modal is clearer for creation
- Separate pages for create/edit → Rejected: Overkill for simple CRUD
- Confirmation dialog for enable/disable → Accepted: Add for safety

---

### 5. Data Transfer Objects (DTOs)

**Decision**: Create separate DTOs for different operations

**DTOs**:
```java
// Response DTO (no password)
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private Boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

// Create request (includes password)
public class CreateUserRequest {
    private String username;
    private String password;
    private String email;
}

// Status update request
public class UpdateUserStatusRequest {
    private Boolean enabled;
}
```

**Rationale**:
- Never expose password hashes in responses
- Separate request/response models provide clear contracts
- Follows existing DTO pattern in codebase (LoginRequest, LoginResponse)

---

### 6. Service Layer

**Decision**: Create `UserService` class for business logic

**Responsibilities**:
- User creation with password hashing (BCrypt)
- User listing with DTO mapping
- Status updates with validation
- Check for duplicate usernames/emails

**Rationale**:
- Separates business logic from controller
- Centralizes password hashing logic
- Makes testing easier (mock service in controller tests)
- Follows Spring Boot best practices

**Alternatives Considered**:
- Put logic directly in controller → Rejected: Violates separation of concerns
- Use existing auth service → Rejected: Different domain, should be separate

## Risks / Trade-offs

### Risk: No pagination on user list
**Impact**: Performance degradation with large user bases (1000+ users)
**Mitigation**: Acceptable for MVP. Add pagination in future iteration if needed. Database query is simple and fast for reasonable user counts.

### Risk: Hardcoded admin check is not scalable
**Impact**: Cannot support multiple admins or role-based permissions
**Mitigation**: Sufficient for initial release. Design allows easy refactoring to RBAC without API changes. Document as technical debt.

### Risk: Disabling admin user could lock out system
**Impact**: If admin disables themselves, no one can manage users
**Mitigation**: Add validation in service layer to prevent disabling the "admin" user. Show warning in UI.

### Risk: No email validation or uniqueness constraint
**Impact**: Duplicate or invalid emails could be entered
**Mitigation**: Add email format validation in frontend and backend. Add unique constraint in future migration if email becomes critical identifier.

### Risk: Password requirements not enforced
**Impact**: Weak passwords could be created
**Mitigation**: Add basic validation (min length 8 chars) in CreateUserRequest. Full password policy can be added later.

### Trade-off: Modal vs separate page for user creation
**Decision**: Use modal
**Benefit**: Faster workflow, less navigation
**Cost**: Limited space for complex forms (acceptable for simple user creation)

## Migration Plan

### Phase 1: Database Migration
1. Deploy Flyway migration `V2__add_user_management_fields.sql`
2. Verify existing users have `enabled=true` and timestamps populated
3. No downtime required (additive changes only)

### Phase 2: Backend Deployment
1. Deploy new UserController, UserService, DTOs
2. Existing auth endpoints remain unchanged
3. New endpoints are additive, no breaking changes
4. Test with Swagger UI before frontend deployment

### Phase 3: Frontend Deployment
1. Deploy new Users page and navigation menu item
2. Add "Users" menu item to MainLayout sidebar
3. Test user creation, listing, enable/disable flows
4. Verify admin-only access (non-admin should see 403)

### Rollback Strategy
- Database: Migration is additive, no rollback needed
- Backend: Revert to previous version, new endpoints simply unavailable
- Frontend: Revert to previous version, remove Users menu item

## Open Questions

1. **Should email be required or optional?**
   Recommendation: Make optional for MVP, can enforce later

2. **Should we send email notifications when users are created/disabled?**
   Recommendation: Out of scope for MVP, add in future iteration

3. **Should we show last login timestamp?**
   Recommendation: Not in MVP, requires tracking login events (future enhancement)

4. **Should disabled users be able to login?**
   Recommendation: Yes, add check in AuthController.login() to reject disabled users

5. **Should we allow editing username after creation?**
   Recommendation: No, username is immutable (primary identifier in auth system)
