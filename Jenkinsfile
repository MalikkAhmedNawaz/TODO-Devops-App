pipeline {
    agent any
    
    environment {
        APP_NAME = "todo-app"
        APP_PORT = "3000"
    }
    
    stages {
        stage('Cleanup') {
            steps {
                echo '🧹 Cleaning up old containers...'
                sh '''
                    docker-compose down || true
                    docker system prune -f
                '''
            }
        }
        
        stage('Build') {
            steps {
                echo '🔨 Building Docker images...'
                sh 'docker-compose build'
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh '''
                    docker-compose up -d postgres
                    sleep 5
                    docker-compose run --rm app npm test
                '''
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                sh 'docker-compose up -d'
            }
        }
        
        stage('Verify') {
            steps {
                echo '✅ Verifying deployment...'
                sh '''
                    sleep 15
                    echo "Checking if containers are running..."
                    docker ps | grep todo-app-pipeline-app-1
                    echo "Checking application logs..."
                    docker logs todo-app-pipeline-app-1 | grep "Server running"
                    echo "✅ Application verified and running successfully!"
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ ✅ ✅ Pipeline completed successfully!'
            echo "🌐 App accessible at: http://localhost:${APP_PORT}"
            echo "📊 Check running containers: docker ps"
            echo "📝 View logs: docker logs todo-app-pipeline-app-1"
        }
        failure {
            echo '❌ ❌ ❌ Pipeline failed!'
            echo 'Displaying container logs for debugging:'
            sh 'docker-compose logs || true'
        }
        always {
            echo '📊 Pipeline execution finished'
        }
    }
}
