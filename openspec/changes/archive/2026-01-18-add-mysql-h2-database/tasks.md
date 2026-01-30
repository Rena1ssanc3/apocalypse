## 1. Dependencies and Configuration

- [x] 1.1 Add spring-boot-starter-data-jpa dependency to pom.xml
- [x] 1.2 Add mysql-connector-j dependency to pom.xml
- [x] 1.3 Add h2 dependency to pom.xml with runtime scope
- [x] 1.4 Add flyway-core dependency to pom.xml
- [x] 1.5 Add spring-boot-starter-security dependency to pom.xml
- [x] 1.6 Configure H2 datasource properties in application.properties (URL, driver, username, password)
- [x] 1.7 Configure H2 console settings in application.properties (enable console, set path to /h2-console)
- [x] 1.8 Configure JPA/Hibernate properties in application.properties (ddl-auto=none, show-sql, dialect)
- [x] 1.9 Configure Flyway properties in application.properties (locations, baseline-on-migrate)
- [x] 1.10 Disable Spring Security auto-configuration in application.properties

## 2. Database Schema Migration

- [x] 2.1 Create db/migration directory in src/main/resources
- [x] 2.2 Create V1__create_users_table.sql migration script
- [x] 2.3 Add CREATE TABLE statement for users with id (BIGINT AUTO_INCREMENT PRIMARY KEY)
- [x] 2.4 Add username column (VARCHAR(255) NOT NULL UNIQUE) to users table
- [x] 2.5 Add password column (VARCHAR(255) NOT NULL) to users table

## 3. Entity and Repository Layer

- [x] 3.1 Create User entity class in com.example.demo.entity package
- [x] 3.2 Add @Entity and @Table annotations to User class
- [x] 3.3 Add id field with @Id and @GeneratedValue(strategy = GenerationType.IDENTITY)
- [x] 3.4 Add username field with @Column(nullable = false, unique = true)
- [x] 3.5 Add password field with @Column(nullable = false)
- [x] 3.6 Add getters and setters for all User fields
- [x] 3.7 Create UserRepository interface in com.example.demo.repository package
- [x] 3.8 Extend JpaRepository<User, Long> in UserRepository
- [x] 3.9 Add findByUsername(String username) method to UserRepository
- [x] 3.10 Add existsByUsername(String username) method to UserRepository

## 4. Password Security Configuration

- [x] 4.1 Create SecurityConfig class in com.example.demo.config package
- [x] 4.2 Add @Configuration annotation to SecurityConfig
- [x] 4.3 Create passwordEncoder() method that returns BCryptPasswordEncoder
- [x] 4.4 Add @Bean annotation to passwordEncoder() method

## 5. Data Initialization

- [x] 5.1 Create DataInitializer class in com.example.demo.config package
- [x] 5.2 Add @Component annotation to DataInitializer
- [x] 5.3 Implement CommandLineRunner interface in DataInitializer
- [x] 5.4 Inject UserRepository and PasswordEncoder via constructor
- [x] 5.5 Implement run() method to check if admin user exists
- [x] 5.6 Create admin user with username "admin" if not exists
- [x] 5.7 Hash password "admin" using PasswordEncoder before saving
- [x] 5.8 Add log message when admin user is created

## 6. Authentication Controller Updates

- [x] 6.1 Inject UserRepository into AuthController
- [x] 6.2 Inject PasswordEncoder into AuthController
- [x] 6.3 Update login endpoint to query database using UserRepository.findByUsername()
- [x] 6.4 Add password validation using PasswordEncoder.matches()
- [x] 6.5 Return appropriate response for successful authentication
- [x] 6.6 Return 401 Unauthorized for invalid credentials
- [x] 6.7 Handle case where username does not exist without revealing user existence

## 7. Testing and Verification

- [ ] 7.1 Start application and verify Flyway migrations execute successfully
- [ ] 7.2 Check application logs for admin user creation message
- [ ] 7.3 Access H2 console at http://localhost:8080/h2-console
- [ ] 7.4 Verify users table exists with correct schema
- [ ] 7.5 Verify admin user exists in database with hashed password
- [ ] 7.6 Test login with admin/admin credentials via API endpoint
- [ ] 7.7 Test login with invalid credentials returns 401
- [ ] 7.8 Verify BCrypt password hash format in database

## 8. Frontend Integration

- [x] 8.1 Verify AuthController POST /api/auth/login endpoint matches frontend expectations
- [x] 8.2 Ensure login endpoint accepts JSON request body with username and password fields
- [x] 8.3 Create LoginRequest DTO class with username and password fields
- [x] 8.4 Create LoginResponse DTO class with token and user fields
- [x] 8.5 Ensure login response returns token (String) and user object (id, username)
- [x] 8.6 Add @CrossOrigin annotation to AuthController for CORS support during development
- [ ] 8.7 Test login flow from frontend to backend with admin/admin credentials
- [ ] 8.8 Verify frontend receives token and stores it in localStorage
- [ ] 8.9 Verify frontend redirects to home page after successful login
- [ ] 8.10 Verify frontend displays error message for invalid credentials