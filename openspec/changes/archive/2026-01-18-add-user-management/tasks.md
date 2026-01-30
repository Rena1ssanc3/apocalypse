## 1. Database Schema

- [x] 1.1 Create Flyway migration V2__add_user_management_fields.sql
- [x] 1.2 Add email, enabled, created_at, updated_at columns to users table
- [x] 1.3 Add indexes on email and enabled columns
- [ ] 1.4 Test migration runs successfully on H2 database

## 2. Backend DTOs

- [x] 2.1 Create UserDTO class in dto package (id, username, email, enabled, createdAt, updatedAt)
- [x] 2.2 Create CreateUserRequest class in dto package (username, password, email)
- [x] 2.3 Create UpdateUserStatusRequest class in dto package (enabled)
- [x] 2.4 Add validation annotations to DTOs (NotBlank, Email, Size)

## 3. Backend Entity Updates

- [x] 3.1 Update User entity to add email field
- [x] 3.2 Update User entity to add enabled field (default true)
- [x] 3.3 Update User entity to add createdAt timestamp
- [x] 3.4 Update User entity to add updatedAt timestamp with @PreUpdate

## 4. Backend Service Layer

- [x] 4.1 Create UserService class in service package
- [x] 4.2 Implement getAllUsers() method returning List<UserDTO>
- [x] 4.3 Implement createUser() method with password hashing and duplicate check
- [x] 4.4 Implement updateUserStatus() method with admin self-disable prevention
- [x] 4.5 Add DTO mapping methods (entity to DTO conversion)
- [x] 4.6 Add email format validation
- [x] 4.7 Add password length validation (min 8 characters)

## 5. Backend Controller

- [x] 5.1 Create UserController class with @RestController and @RequestMapping("/api/users")
- [x] 5.2 Implement GET /api/users endpoint with admin authorization check
- [x] 5.3 Implement POST /api/users endpoint with admin authorization check
- [x] 5.4 Implement PATCH /api/users/{id}/status endpoint with admin authorization check
- [x] 5.5 Add OpenAPI annotations (@Operation, @Tag) to all endpoints
- [x] 5.6 Add proper error handling and HTTP status codes
- [x] 5.7 Add @CrossOrigin annotation for CORS support

## 6. Authentication Enhancement

- [x] 6.1 Update AuthController login method to check user enabled status
- [x] 6.2 Return appropriate error message when disabled user attempts login
- [ ] 6.3 Test that disabled users cannot authenticate

## 7. Frontend Types

- [x] 7.1 Update User interface in types/api.ts to include email, enabled, createdAt, updatedAt
- [x] 7.2 Create CreateUserRequest interface
- [x] 7.3 Create UpdateUserStatusRequest interface

## 8. Frontend API Service

- [x] 8.1 Create userService.ts in services directory
- [x] 8.2 Implement getUsers() function calling GET /api/users
- [x] 8.3 Implement createUser() function calling POST /api/users
- [x] 8.4 Implement updateUserStatus() function calling PATCH /api/users/{id}/status
- [x] 8.5 Add proper error handling and type definitions

## 9. Frontend User Management Page

- [x] 9.1 Create Users directory in pages
- [x] 9.2 Create Users/index.tsx with main page component
- [x] 9.3 Add Ant Design Table component with columns: Username, Email, Status, Created At, Actions
- [x] 9.4 Implement user list fetching on component mount
- [x] 9.5 Add "Add User" button above table
- [x] 9.6 Add Status column with Tag component (green for enabled, red for disabled)
- [x] 9.7 Add Actions column with Switch component for enable/disable
- [x] 9.8 Format createdAt timestamp for display

## 10. Frontend User Creation Modal

- [x] 10.1 Create Users/CreateUserModal.tsx component
- [x] 10.2 Add Ant Design Form with username, password, email fields
- [x] 10.3 Add form validation rules (required for username/password, email format, min length 8 for password)
- [x] 10.4 Implement form submission calling createUser service
- [x] 10.5 Add success/error message notifications
- [x] 10.6 Refresh user list after successful creation
- [x] 10.7 Close modal after successful creation

## 11. Frontend Status Toggle

- [x] 11.1 Add confirmation Modal when toggling user status
- [x] 11.2 Implement status update calling updateUserStatus service
- [x] 11.3 Add success/error message notifications
- [x] 11.4 Update table data after successful status change
- [x] 11.5 Handle error when admin tries to disable themselves

## 12. Frontend Navigation

- [x] 12.1 Add "Users" menu item to MainLayout sidebar
- [x] 12.2 Add route for /users path in App.tsx
- [x] 12.3 Wrap Users page with ProtectedRoute component
- [x] 12.4 Add appropriate icon for Users menu item

## 13. Testing and Validation

- [ ] 13.1 Test database migration runs successfully
- [ ] 13.2 Test user creation via API with Swagger UI
- [ ] 13.3 Test user listing via API with Swagger UI
- [ ] 13.4 Test status update via API with Swagger UI
- [ ] 13.5 Test admin authorization (403 for non-admin users)
- [ ] 13.6 Test disabled user cannot login
- [ ] 13.7 Test admin cannot disable themselves
- [ ] 13.8 Test duplicate username rejection
- [ ] 13.9 Test password validation (min 8 chars)
- [ ] 13.10 Test email format validation
- [ ] 13.11 Test frontend user list displays correctly
- [ ] 13.12 Test frontend user creation flow
- [ ] 13.13 Test frontend enable/disable toggle with confirmation
- [ ] 13.14 Test error handling and user feedback messages
