pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'apocalypse'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        DOCKER_REGISTRY = 'docker.io'
        SPRING_PROFILES_ACTIVE = 'test'
        JAVA_HOME = '/usr/lib/jvm/java-21-openjdk-amd64'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Verify Java') {
            steps {
                echo 'Verifying Java version...'
                sh '''
                    echo "JAVA_HOME: $JAVA_HOME"
                    if [ -d "$JAVA_HOME" ]; then
                        export PATH="$JAVA_HOME/bin:$PATH"
                        java -version
                    else
                        echo "Java 21 not found at $JAVA_HOME"
                        echo "Available Java installations:"
                        ls -la /usr/lib/jvm/ || echo "No JVM directory found"
                        exit 1
                    fi
                '''
            }
        }

        stage('Build') {
            steps {
                echo 'Building application...'
                sh '''
                    export PATH="$JAVA_HOME/bin:$PATH"
                    ./mvnw clean compile -DskipTests
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh '''
                    export PATH="$JAVA_HOME/bin:$PATH"
                    ./mvnw test
                '''
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
                sh '''
                    export PATH="$JAVA_HOME/bin:$PATH"
                    ./mvnw package -DskipTests
                '''
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

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                    docker.build("${DOCKER_IMAGE}:latest")
                }
            }
        }

        stage('Push Docker Image') {
            when {
                branch 'main'
            }
            steps {
                echo 'Pushing Docker image to registry...'
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials') {
                        docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
                        docker.image("${DOCKER_IMAGE}:latest").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to Kubernetes...'
                script {
                    // Deploy using Helm
                    sh """
                        helm upgrade --install apocalypse ./helm/apocalypse \
                            --set image.tag=${DOCKER_TAG} \
                            --namespace production \
                            --create-namespace \
                            --wait
                    """
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
