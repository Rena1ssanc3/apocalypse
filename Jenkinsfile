pipeline {
    agent any

    tools {
        maven 'Maven-3.9'
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
                echo 'Building application...'
                sh './mvnw clean compile -DskipTests'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh './mvnw test'
            }
            post {
                always {
                    junit '**/target/surefire-reports/*.xml'
                    jacoco(
                        execPattern: '**/target/jacoco.exec',
                        classPattern: '**/target/classes',
                        sourcePattern: '**/src/main/java'
                    )
                }
            }
        }

        stage('Package') {
            steps {
                echo 'Packaging application...'
                sh './mvnw package -DskipTests'
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
