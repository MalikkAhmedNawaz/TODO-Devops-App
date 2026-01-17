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
                    sleep 10
                    curl -f http://localhost:3000 || exit 1
                    echo "Application is running successfully!"
                '''
                // Wait 10 seconds for app to fully start
                // curl -f = Fail if HTTP error
                // exit 1 = Exit with error if curl fails
            }
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

**Save:** `Ctrl + X`, `Y`, `Enter`

### **📖 Understanding the Pipeline:**

**Pipeline Structure:**
```
Pipeline
├── Stage 1: Cleanup      (Remove old stuff)
├── Stage 2: Build        (Create Docker images)
├── Stage 3: Test         (Run automated tests)
├── Stage 4: Deploy       (Start containers)
└── Stage 5: Verify       (Check if working)
