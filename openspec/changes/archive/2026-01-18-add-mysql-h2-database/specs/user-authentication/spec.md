## ADDED Requirements

### Requirement: Backend authentication endpoint
The system SHALL provide backend API endpoint for user authentication.

#### Scenario: Login endpoint availability
- **WHEN** client sends POST request to /api/auth/login
- **THEN** backend SHALL process authentication request

#### Scenario: Credential validation against database
- **WHEN** login request contains username and password
- **THEN** system SHALL query database for user with matching username

#### Scenario: Successful authentication response
- **WHEN** user credentials are valid
- **THEN** system SHALL return success response with authentication token

#### Scenario: Failed authentication response
- **WHEN** user credentials are invalid
- **THEN** system SHALL return 401 Unauthorized with error message

#### Scenario: Password hash validation
- **WHEN** validating user credentials
- **THEN** system SHALL use BCrypt to compare provided password with stored hash

#### Scenario: Missing user handling
- **WHEN** username does not exist in database
- **THEN** system SHALL return authentication failure without revealing user existence
