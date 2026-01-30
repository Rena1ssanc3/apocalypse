### Requirement: Create new user via form
The system SHALL provide a form interface for administrators to create new user accounts with username, password, and optional email.

#### Scenario: Admin opens user creation form
- **WHEN** an admin clicks the "Add User" button on the Users page
- **THEN** the system displays a modal form with fields for username, password, and email

#### Scenario: Successful user creation via UI
- **WHEN** an admin submits the form with valid username and password
- **THEN** the system creates the user, closes the modal, refreshes the user list, and displays a success message

#### Scenario: Form validation for required fields
- **WHEN** an admin attempts to submit the form without username or password
- **THEN** the system displays validation errors and prevents submission

### Requirement: Create user via API
The system SHALL provide a REST API endpoint to create new users.

#### Scenario: Successful user creation
- **WHEN** an authenticated admin sends POST request to `/api/users` with valid username and password
- **THEN** the system creates the user with hashed password, enabled status set to true, and returns HTTP 201 with the created user data

#### Scenario: Duplicate username rejected
- **WHEN** an admin attempts to create a user with an existing username
- **THEN** the system returns HTTP 409 Conflict with an error message

#### Scenario: Non-admin user attempts to create user
- **WHEN** a non-admin authenticated user sends POST request to `/api/users`
- **THEN** the system returns HTTP 403 Forbidden

#### Scenario: Invalid request data
- **WHEN** the request is missing required fields (username or password)
- **THEN** the system returns HTTP 400 Bad Request with validation errors

### Requirement: Password security
The system SHALL hash passwords using BCrypt before storing them in the database.

#### Scenario: Password is hashed on creation
- **WHEN** a new user is created with a plain text password
- **THEN** the system stores a BCrypt hashed version of the password, not the plain text

### Requirement: Password validation
The system SHALL enforce minimum password length of 8 characters.

#### Scenario: Password too short
- **WHEN** an admin attempts to create a user with a password shorter than 8 characters
- **THEN** the system returns HTTP 400 Bad Request with a validation error message

#### Scenario: Valid password length
- **WHEN** an admin creates a user with a password of 8 or more characters
- **THEN** the system accepts the password and creates the user

### Requirement: Email validation
The system SHALL validate email format when provided.

#### Scenario: Invalid email format
- **WHEN** an admin provides an email that does not match standard email format
- **THEN** the system returns HTTP 400 Bad Request with a validation error

#### Scenario: Email is optional
- **WHEN** an admin creates a user without providing an email
- **THEN** the system creates the user successfully with null email
