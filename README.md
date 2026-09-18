# Playwright Generated Framework

This folder is prepared to run AI-generated Playwright test files.

## Project Structure

- `sanity/` stores sanity spec files
- `regression/` stores regression spec files
- `playwright.config.js` contains the Playwright config
- `Jenkinsfile` contains the CI/CD pipeline definition
- `package.json` contains the test script and dependencies

## Install

Run these commands inside this folder:

```powershell
npm install
npx playwright install
```

## Run All Tests

```powershell
npm test
```

## Run Sanity Tests

```powershell
npm run test:sanity
```

## Run Regression Tests

```powershell
npm run test:regression
npm run test:customer
npm run test:estimates
```

## Jenkins CI/CD

Use the root `Jenkinsfile` with a Pipeline job that checks out **GitHub** (`githubUrl` in `.project-metadata.json`). Parameters:

- `BROWSER` — chromium (default), msedge, firefox, webkit
- `HEADED` — false for CI
- `TARGET` — suite folder or a `.spec.js` path
- `WORKERS` — default 4

```powershell
TARGET=regression
TARGET=regression/estimates
TARGET=regression/customer
TARGET=regression/product-item
TARGET=regression/opportunity
TARGET=regression/rfp
```

## Run One Spec File

```powershell
npx playwright test sanity/<your-file>.spec.js --project=chromium --headed
```

## Run On Specific Browsers

```powershell
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Notes

- Save or copy typed generated specs into `sanity/` or `regression/`
- Use `--headed` if you want to watch the browser run
- Current framework folder: `C:\RFP\RFP`
