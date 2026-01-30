## Context

The application is a Spring Boot 3.4.1 web application with a React frontend. Currently, it has basic authentication UI (login page) but lacks backend persistence for user data. The AuthController exists but likely uses mock or in-memory authentication. This design adds database persistence using Spring Data JPA with H2 for development and MySQL compatibility for production.

**Current State:**
- Spring Boot starter-web only (no data dependencies)
- Minimal application.properties configuration
- Frontend authentication flow exists (user-authentication spec)
- No database entities or repositories

**Constraints:**
- Must maintain MySQL compatibility for production deployments
- Must support local development without external database setup
- Must initialize with a default admin user for immediate testing

## Goals / Non-Goals

**Goals:**
- Add JPA/Hibernate ORM layer for database abstraction
- Configure H2 embedded database for development environment
- Create User entity with basic authentication fields (username, password)
- Implement repository layer for user data access
- Add Flyway for database schema migration management
- Implement BCrypt password hashing for secure credential storage
- Seed default admin user with hashed password on application startup
- Enable H2 console for development database inspection

**Non-Goals:**
- User registration or profile management endpoints
- Production database configuration (MySQL connection strings for production)
- Multiple user roles or permissions beyond basic user entity
- Advanced security features (account lockout, password reset, etc.)

## Decisions

### Decision 1: H2 for Development, MySQL Compatibility for Production

**Choice:** Use H2 embedded database with MySQL compatibility mode

**Rationale:**
- H2 eliminates external database setup for local development
- MySQL mode ensures SQL compatibility with production database
- Zero configuration for developers to get started
- H2 console provides easy database inspection during development

**Alternatives Considered:**
- Pure MySQL: Requires Docker or local MySQL installation, adds setup friction
- PostgreSQL: Different SQL dialect, would need separate H2 compatibility mode
- In-memory only: Data lost on restart, harder to debug persistence issues

### Decision 2: Flyway for Schema Migration Management

**Choice:** Use Flyway for database schema versioning with SQL migration scripts

**Rationale:**
- Provides explicit version control for database schema changes
- Works consistently across development (H2) and production (MySQL) environments
- Migration scripts are portable and reviewable
- Industry standard for production-ready applications
- Prevents schema drift between environments

**Alternatives Considered:**
- Hibernate auto-DDL (ddl-auto=update): Risky for production, no version control, can cause data loss
- Liquibase: Similar to Flyway but more complex XML/YAML syntax
- Manual schema.sql: No versioning, harder to track changes over time

### Decision 3: CommandLineRunner for Data Seeding

**Choice:** Use CommandLineRunner bean to seed default admin user on startup

**Rationale:**
- Runs after application context is fully initialized
- Simple conditional check prevents duplicate seeding
- Easy to disable or modify for different environments
- Standard Spring Boot pattern for initialization logic

**Alternatives Considered:**
- data.sql file: Less flexible, harder to add conditional logic
- @PostConstruct in repository: Runs too early, may have transaction issues
- Manual database seeding: Requires developers to remember extra steps

### Decision 4: BCrypt Password Hashing

**Choice:** Use BCrypt password hashing via Spring Security's PasswordEncoder

**Rationale:**
- Industry standard for password hashing with built-in salt generation
- Spring Security provides PasswordEncoder interface with BCrypt implementation
- Protects against rainbow table attacks and brute force attempts
- Minimal additional complexity with Spring Boot auto-configuration
- Essential security practice even for development environments

**Alternatives Considered:**
- Plain text passwords: Insecure, bad practice even for development
- SHA-256/SHA-512: Requires manual salt management, less secure than BCrypt
- Argon2: More secure but requires additional dependencies, BCrypt sufficient for this use case

## Risks / Trade-offs

**Risk:** H2 SQL compatibility may not be 100% with MySQL
→ **Mitigation:** Use H2 MySQL mode, write standard SQL in Flyway migrations, test critical queries, document any compatibility issues found during development.

**Risk:** Flyway migration scripts must be carefully written to avoid errors
→ **Mitigation:** Test migrations locally with H2 before deploying. Flyway prevents re-running migrations, so errors require new migration files to fix.

**Risk:** Default admin user may be forgotten in production
→ **Mitigation:** Use environment-specific configuration or profiles to control seeding. Add warning log message when default user is created.

**Risk:** Spring Security dependency adds auto-configuration that may affect application behavior
→ **Mitigation:** Only use PasswordEncoder bean, disable Spring Security auto-configuration for now. Full Spring Security integration can be added later.

**Trade-off:** Flyway adds migration file management overhead
→ **Chosen:** Flyway for production-ready schema management. Trade-off: More files to maintain, but essential for tracking schema changes and preventing drift.

## Migration Plan

**Development Environment:**
1. Add dependencies to pom.xml (spring-boot-starter-data-jpa, mysql-connector-j, h2, flyway-core, spring-boot-starter-security)
2. Add H2 and Flyway configuration to application.properties
3. Create Flyway migration script: V1__create_users_table.sql
4. Create User entity with JPA annotations
5. Create UserRepository interface
6. Configure PasswordEncoder bean (BCrypt)
7. Create DataInitializer with CommandLineRunner to seed admin user with hashed password
8. Update AuthController to use UserRepository and validate hashed passwords
9. Test via H2 console at http://localhost:8080/h2-console

**Rollback Strategy:**
- Remove dependencies from pom.xml
- Revert application.properties changes
- Delete Flyway migration scripts
- Delete entity/repository classes
- Remove PasswordEncoder configuration
- Restore previous AuthController implementation

**Production Considerations:**
- Add Spring profile-specific configuration (application-prod.properties)
- Configure MySQL datasource URL, username, password
- Disable H2 console in production
- Flyway will automatically run migrations on production database
- Ensure Flyway migration scripts are tested before production deployment
- Consider different admin credentials for production environment

## Open Questions

None - design is straightforward for initial implementation.
