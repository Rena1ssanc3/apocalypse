### Requirement: Display all users in table view
The system SHALL display all users in a table/list view showing username, email, enabled status, and creation timestamp.

#### Scenario: Admin views user list
- **WHEN** an authenticated admin user navigates to the Users page
- **THEN** the system displays a table with all users including their username, email, status, and created date

#### Scenario: User list shows enabled status
- **WHEN** the user list is displayed
- **THEN** each user row shows their enabled status as a visual indicator (e.g., tag or badge)

#### Scenario: Empty user list
- **WHEN** no users exist in the system
- **THEN** the system displays an empty state message

### Requirement: Fetch users via API
The system SHALL provide a REST API endpoint to retrieve all users.

#### Scenario: Successful user list retrieval
- **WHEN** an authenticated admin sends GET request to `/api/users`
- **THEN** the system returns HTTP 200 with an array of user objects containing id, username, email, enabled status, createdAt, and updatedAt

#### Scenario: Non-admin user attempts to list users
- **WHEN** a non-admin authenticated user sends GET request to `/api/users`
- **THEN** the system returns HTTP 403 Forbidden

#### Scenario: Unauthenticated request
- **WHEN** an unauthenticated user sends GET request to `/api/users`
- **THEN** the system returns HTTP 401 Unauthorized

### Requirement: Password exclusion from responses
The system SHALL NOT include password hashes in user list API responses.

#### Scenario: User data excludes password
- **WHEN** the system returns user data via `/api/users`
- **THEN** the response objects do not contain password or password hash fields
