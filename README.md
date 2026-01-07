# HR Helper - TeamSync HR Tool

A React application for HR management, built with Vite and TypeScript.

## Features

- **Project Initialization**: Configured with `package.json` and essential dependencies.
- **CI/CD**: Automated deployment to GitHub Pages using GitHub Actions.
- **Security**: Proper `.gitignore` configuration for sensitive files and folders.

## Prerequisites

- **Node.js**: version 20 or higher.
- **npm**: version 10 or higher.

## Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Create a `.env` file based on `.env.example` (if available) or set your API keys directly.
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

3.  **Run Locally**
    Start the development server:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal) to view it in the browser.

## Deployment

The project is configured to automatically deploy to **GitHub Pages** when pushing to the `main` branch.

### Manual Deployment
You can also deploy manually:
```bash
npm run deploy
```

### GitHub Actions Setup
1. Go to your repository settings -> **Secrets and variables** -> **Actions**.
2. Add a new repository secret named `GEMINI_API_KEY` with your API key.
3. Ensure **GitHub Pages** is enabled in repository settings (Settings -> Pages -> Build and deployment -> Source: GitHub Actions).

## Project Structure

- `src/`: Source code
- `.github/workflows/`: CI/CD workflows
- `vite.config.ts`: Vite configuration

