# Jenkins CI/CD Configuration

This document describes the Jenkins setup for the Apocalypse project.

## Prerequisites

### Jenkins Plugins Required
- Pipeline
- Docker Pipeline
- Kubernetes CLI
- JUnit
- JaCoCo
- Git

### Jenkins Configuration

1. **JDK Configuration**
   - Go to: Manage Jenkins → Global Tool Configuration
   - Add JDK: Name = `JDK-21`, Install automatically or specify JAVA_HOME

2. **Docker Registry Credentials**
   - Go to: Manage Jenkins → Credentials
   - Add credentials: ID = `docker-credentials`
   - Type: Username with password
   - Enter your Docker registry credentials

3. **Kubernetes Configuration** (Optional for deployment)
   - Install Kubernetes CLI plugin
   - Configure kubeconfig in Jenkins credentials

## Pipeline Stages

### 1. Checkout
- Checks out source code from SCM

### 2. Build
- Compiles the application using Maven Wrapper
- Command: `./mvnw clean compile -DskipTests`

### 3. Test
- Runs unit tests
- Generates JUnit test reports
- Generates JaCoCo code coverage reports
- Command: `./mvnw test`

### 4. Package
- Packages the application as a JAR file
- Command: `./mvnw package -DskipTests`

### 5. Code Quality Analysis
- Optional SonarQube integration
- Uncomment the SonarQube section in Jenkinsfile to enable

### 6. Build Docker Image
- Builds Docker image with build number tag
- Also tags as `latest`
- Images: `apocalypse:${BUILD_NUMBER}` and `apocalypse:latest`

### 7. Push Docker Image
- **Condition**: Only runs on `main` branch
- Pushes Docker images to registry
- Requires `docker-credentials` configured in Jenkins

### 8. Deploy to Kubernetes
- **Condition**: Only runs on `main` branch
- Deploys application using Helm
- Deploys to `production` namespace
- Uses the build-specific image tag

## Environment Variables

- `DOCKER_IMAGE`: Docker image name (default: `apocalypse`)
- `DOCKER_TAG`: Build number used as image tag
- `DOCKER_REGISTRY`: Docker registry URL (default: `docker.io`)
- `SPRING_PROFILES_ACTIVE`: Spring profile for tests (default: `test`)

## Setting Up a Jenkins Pipeline Job

1. Create a new Pipeline job in Jenkins
2. Configure SCM (Git repository URL)
3. Set Pipeline script from SCM
4. Point to `Jenkinsfile` in repository root
5. Configure branch to build (e.g., `main`, `develop`)
6. Save and run the pipeline

## Customization

### Modify Docker Registry
Edit the `DOCKER_REGISTRY` environment variable in Jenkinsfile:
```groovy
environment {
    DOCKER_REGISTRY = 'your-registry.com'
}
```

### Enable SonarQube
Uncomment the SonarQube section in the Code Quality Analysis stage:
```groovy
withSonarQubeEnv('SonarQube') {
    sh './mvnw sonar:sonar'
}
```

### Skip Kubernetes Deployment
Comment out or remove the "Deploy to Kubernetes" stage if not using Kubernetes.

## Notifications

To enable notifications, configure in the `post` section:

**Email Notifications:**
```groovy
success {
    emailext (
        subject: "Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body: "The build completed successfully.",
        to: "team@example.com"
    )
}
```

**Slack Notifications:**
```groovy
success {
    slackSend (
        color: 'good',
        message: "Build Successful: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    )
}
```

## Troubleshooting

### Build Fails at Test Stage
- Check test logs in Jenkins console output
- Verify H2 database configuration in `application-test.yaml`
- Run tests locally: `./mvnw test`

### Docker Build Fails
- Ensure Docker is installed on Jenkins agent
- Verify Dockerfile syntax
- Check Docker daemon is running

### Kubernetes Deployment Fails
- Verify kubeconfig is properly configured
- Check Helm chart syntax: `helm lint ./helm/apocalypse`
- Ensure namespace exists or create-namespace flag is set

## Pipeline Diagram

```
Checkout → Build → Test → Package → Code Quality → Docker Build → Docker Push → K8s Deploy
                                                                      ↓              ↓
                                                                  (main only)   (main only)
```



