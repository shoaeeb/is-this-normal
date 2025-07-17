# Deploying to Render

This guide explains how to deploy the "Is This Normal?" application to Render as a full-stack application.

## Deployment Steps

### 1. Sign up for Render
- Go to [render.com](https://render.com/) and sign up for an account
- Verify your email and log in

### 2. Create a New Web Service
- Click on "New +" button in the dashboard
- Select "Web Service"
- Connect your GitHub repository (you'll need to authorize Render)
- Select the repository with your project

### 3. Configure the Web Service
- **Name**: Enter a name for your service (e.g., "is-this-normal")
- **Region**: Choose a region closest to your target audience
- **Branch**: Select your main branch (usually "main" or "master")
- **Runtime**: Select "Node"
- **Build Command**: `npm install && npm run heroku-postbuild`
- **Start Command**: `npm start`

### 4. Add Environment Variables
- Scroll down to the "Environment" section
- Add the following variables:
  - `NODE_ENV`: `production`
  - `PORT`: `10000` (Render assigns its own port, but we set this as fallback)
  - `MONGO_URI`: Your MongoDB connection string

### 5. Set Resource Settings
- Choose the appropriate plan (Free tier is fine for starting)
- Enable "Auto-Deploy" if you want automatic deployments when you push to GitHub

### 6. Create Web Service
- Click "Create Web Service"
- Wait for the build and deployment process to complete (this may take a few minutes)

### 7. Verify Deployment
- Visit your Render URL to ensure the application is working
- Test key functionality like:
  - Viewing questions
  - Submitting questions
  - Voting
  - Commenting

## Important Notes
- Render's free tier will spin down after periods of inactivity, causing a delay on the first request
- The application includes a keep-alive function to prevent this, but it may not always work
- For a production app, consider upgrading to a paid plan
- The MongoDB connection should be from a cloud provider like MongoDB Atlas, not a local database