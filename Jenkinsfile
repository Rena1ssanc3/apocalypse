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
  - name: kaniko
    image: gcr.io/kaniko-project/executor:debug
    command:
    - /busybox/cat
    tty: true
    volumeMounts:
    - name: docker-config
      mountPath: /kaniko/.docker
  volumes:
  - name: docker-config
    emptyDir: {}
'''
        }
    }

    environment {
        DOCKER_IMAGE = 'apocalypse'
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        HARBOR_REGISTRY = 'harbor.byterevo.com'
        HARBOR_PROJECT = 'library'
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

        stage('Build Docker Image') {
            steps {
                container('kaniko') {
                    echo 'Building Docker image with Kaniko...'
                    script {
                        sh """
                            /kaniko/executor \
                                --context=\${WORKSPACE} \
                                --dockerfile=\${WORKSPACE}/Dockerfile \
                                --destination=${HARBOR_REGISTRY}/${HARBOR_PROJECT}/${DOCKER_IMAGE}:${DOCKER_TAG} \
                                --destination=${HARBOR_REGISTRY}/${HARBOR_PROJECT}/${DOCKER_IMAGE}:latest \
                                --skip-tls-verify \
                                --no-push
                        """
                    }
                }
            }
        }

        stage('Push Docker Image') {
            when {
                branch 'main'
            }
            steps {
                container('kaniko') {
                    echo 'Pushing Docker image to Harbor...'
                    withCredentials([usernamePassword(credentialsId: 'harbor-credentials', usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_PASS')]) {
                        script {
                            sh """
                                echo '{"auths":{"${HARBOR_REGISTRY}":{"username":"${HARBOR_USER}","password":"${HARBOR_PASS}"}}}' > /kaniko/.docker/config.json
                                /kaniko/executor \
                                    --context=\${WORKSPACE} \
                                    --dockerfile=\${WORKSPACE}/Dockerfile \
                                    --destination=${HARBOR_REGISTRY}/${HARBOR_PROJECT}/${DOCKER_IMAGE}:${DOCKER_TAG} \
                                    --destination=${HARBOR_REGISTRY}/${HARBOR_PROJECT}/${DOCKER_IMAGE}:latest \
                                    --skip-tls-verify
                            """
                        }
                    }
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
            echo 'Build completed. Workspace will be cleaned up when pod terminates.'
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
