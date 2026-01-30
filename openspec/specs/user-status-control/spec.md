### Requirement: Enable or disable user accounts
The system SHALL allow administrators to enable or disable user accounts to control access without deleting user data.

#### Scenario: Admin enables a disabled user
- **WHEN** an admin toggles the status switch for a disabled user to enabled
- **THEN** the system updates the user's enabled status to true and displays a success message

#### Scenario: Admin disables an enabled user
- **WHEN** an admin toggles the status switch for an enabled user to disabled
- **THEN** the system updates the user's enabled status to false and displays a success message

#### Scenario: Status change confirmation
- **WHEN** an admin attempts to change a user's status
- **THEN** the system displays a confirmation dialog before applying the change

### Requirement: Update user status via API
The system SHALL provide a REST API endpoint to update user enabled status.

#### Scenario: Successful status update
- **WHEN** an authenticated admin sends PATCH request to `/api/users/{id}/status` with enabled boolean value
- **THEN** the system updates the user's enabled status and returns HTTP 200 with updated user data

#### Scenario: Non-admin attempts status update
- **WHEN** a non-admin authenticated user sends PATCH request to `/api/users/{id}/status`
- **THEN** the system returns HTTP 403 Forbidden

#### Scenario: User not found
- **WHEN** an admin attempts to update status for a non-existent user ID
- **THEN** the system returns HTTP 404 Not Found

### Requirement: Prevent admin self-disable
The system SHALL prevent the admin user from disabling their own account to avoid system lockout.

#### Scenario: Admin attempts to disable themselves
- **WHEN** the admin user attempts to disable the "admin" account
- **THEN** the system returns HTTP 400 Bad Request with an error message explaining the restriction

#### Scenario: Admin can disable other users
- **WHEN** the admin user disables a non-admin user account
- **THEN** the system successfully updates the status

### Requirement: Disabled users cannot login
The system SHALL reject login attempts from disabled users.

#### Scenario: Disabled user attempts login
- **WHEN** a user with enabled status set to false attempts to login with valid credentials
- **THEN** the system returns HTTP 401 Unauthorized with a message indicating the account is disabled

#### Scenario: Enabled user can login
- **WHEN** a user with enabled status set to true attempts to login with valid credentials
- **THEN** the system authenticates successfully and returns a token
