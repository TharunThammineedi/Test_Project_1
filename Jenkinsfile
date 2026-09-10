pipeline {
  agent any

  options {
    timestamps()
  }

  parameters {
    choice(
      name: 'BROWSER',
      choices: ['chromium', 'msedge', 'firefox', 'webkit'],
      description: 'Playwright project name'
    )
    booleanParam(
      name: 'HEADED',
      defaultValue: false,
      description: 'Headed mode (agent must have a display)'
    )
    string(
      name: 'TARGET',
      defaultValue: 'regression',
      description: 'Folder or spec: regression, sanity, regression/rfp, regression/estimates, regression/opportunity, regression/product-item, or a .spec.js path'
    )
    string(
      name: 'WORKERS',
      defaultValue: '4',
      description: 'Playwright workers (4 = same as local parallel)'
    )
  }

  environment {
    CI = 'true'
    HEADLESS = "${params.HEADED ? 'false' : 'true'}"
  }

  stages {
    stage('Install') {
      steps {
        script {
          dir(projectRoot()) {
            runCmd('npm ci')
            if (isUnix()) {
              sh "npx playwright install --with-deps ${installBrowser()}"
            } else {
              powershell "npx playwright install ${installBrowser()}"
            }
          }
        }
      }
    }

    stage('Run Tests') {
      steps {
        script {
          dir(projectRoot()) {
            if (isUnix()) {
              sh 'rm -f data/session-data.json data/session-data-w*.json'
            } else {
              powershell 'Remove-Item -Force -ErrorAction SilentlyContinue data/session-data.json, data/session-data-w*.json'
            }
            def headedArg = params.HEADED ? ' --headed' : ''
            def workers = Math.max(1, (params.WORKERS ?: '4').toInteger())
            runCmd("npx playwright test \"${params.TARGET.trim()}\" --project=${params.BROWSER} --workers=${workers}${headedArg}")
          }
        }
      }
    }
  }

  post {
    always {
      script {
        dir(projectRoot()) {
          archiveArtifacts artifacts: 'test-results/**, playwright-report/**, allure-results/**, allure-report/**', allowEmptyArchive: true
          try {
            allure([
              includeProperties: false,
              jdk: '',
              results: [[path: 'allure-results']]
            ])
          } catch (ignored) {
            echo 'Allure plugin not installed; HTML report still archived'
          }
          try {
            publishHTML([
              reportDir: 'playwright-report',
              reportFiles: 'index.html',
              reportName: 'Playwright HTML Report',
              keepAll: true,
              alwaysLinkToLastBuild: true,
              allowMissing: true
            ])
          } catch (ignored) {
            echo 'HTML Publisher plugin not installed; report is in artifacts'
          }
        }
      }
    }
  }
}

def projectRoot() {
  fileExists('package.json') ? '.' : 'Project1'
}

def installBrowser() {
  params.BROWSER == 'msedge' ? 'msedge' : params.BROWSER
}

def runCmd(cmd) {
  if (isUnix()) {
    sh cmd
  } else {
    powershell cmd
  }
}
