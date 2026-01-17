// ========================================
// JENKINSFILE - CI/CD Pipeline Definition
// ========================================

pipeline {
    agent any  // Run on any available Jenkins agent
    
    environment {
        APP_NAME = "todo-app"
        APP_PORT = "3000"
    }
    
    stages {
        // ==========================================
        // STAGE 1: Cleanup old containers/images
        // ==========================================
        stage('Cleanup') {
            steps {
                echo '🧹 Cleaning up old containers...'
                sh '''
                    docker-compose down || true
                    docker system prune -f
                '''
                // || true = Don't fail if nothing to clean
                // -f = Force, no confirmation needed
            }
        }
        
        // ==========================================
        // STAGE 2: Build Docker images
        // ==========================================
        stage('Build') {
            steps {
                echo '🔨 Building Docker images...'
                sh 'docker-compose build'
                // Builds images defined in docker-compose.yml
            }
        }
        
        // ==========================================
        // STAGE 3: Run tests
        // ==========================================
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh '''
                    docker-compose up -d postgres
                    sleep 5
                    docker-compose run --rm app npm test
                '''
                // Start database first
                // Wait 5 seconds for it to be ready
                // Run tests in app container
            }
        }
        
        // ==========================================
        // STAGE 4: Deploy application
        // ==========================================
        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                sh 'docker-compose up -d'
                // Start all services in background
            }
        }
        
        // ==========================================
        // STAGE 5: Verify deployment
        // ==========================================
       stage('Verify') {
    steps {
        echo '✅ Verifying deployment...'
        sh '''
            sleep 15
            docker ps | grep todo-app-pipeline-app-1
            docker logs todo-app-pipeline-app-1 | grep "Server running"
            echo "✅ Application is running successfully!"
        '''
    }
}
    
    // ==========================================
    // POST-BUILD ACTIONS
    // ==========================================
    post {
        success {
            echo '✅ ✅ ✅ Pipeline completed successfully!'
            echo "🌐 App running at: http://localhost:${APP_PORT}"
        }
        failure {
            echo '❌ ❌ ❌ Pipeline failed!'
            sh 'docker-compose logs'
            // Show logs to help debug
        }
        always {
            echo '📊 Pipeline finished'
        }
    }
}
