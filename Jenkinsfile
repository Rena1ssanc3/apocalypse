pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: maven
    image: maven:3.9-eclipse-temurin-21
    command:
    - cat
    tty: true
'''
        }
    }

    environment {
        DOCKER_IMAGE = 'apocalypse'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_REGISTRY = 'docker.io'
        SPRING_PROFILES_ACTIVE = 'test'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                container('maven') {
                    echo 'Building application...'
                    sh 'mvn clean compile -DskipTests'
                }
            }
        }

        stage('Test') {
            steps {
                container('maven') {
                    echo 'Running tests...'
                    sh 'mvn test'
                }
            }
            post {
                always {
                    script {
                        // Publish test results if JUnit plugin is available
                        try {
                            step([$class: 'JUnitResultArchiver', testResults: '**/target/surefire-reports/*.xml'])
                        } catch (Exception e) {
                            echo "JUnit plugin not available: ${e.message}"
                        }
                        // Publish code coverage if JaCoCo plugin is available
                        try {
                            step([$class: 'JacocoPublisher',
                                execPattern: '**/target/jacoco.exec',
                                classPattern: '**/target/classes',
                                sourcePattern: '**/src/main/java'
                            ])
                        } catch (Exception e) {
                            echo "JaCoCo plugin not available: ${e.message}"
                        }
                    }
                }
            }
        }

        stage('Package') {
            steps {
                container('maven') {
                    echo 'Packaging application...'
                    sh 'mvn package -DskipTests'
                }
            }
        }

        stage('Code Quality Analysis') {
            steps {
                echo 'Running code quality analysis...'
                script {
                    // SonarQube analysis (optional - requires SonarQube server)
                    // withSonarQubeEnv('SonarQube') {
                    //     sh './mvnw sonar:sonar'
                    // }
                    echo 'Code quality analysis skipped (configure SonarQube if needed)'
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
            // Send notification (configure email/Slack if needed)
        }
        failure {
            echo 'Pipeline failed!'
            // Send failure notification
        }
    }
}
