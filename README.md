# Is This Normal?

A platform for anonymous validation of behaviors and situations. Users can submit questions about their habits, thoughts, or behaviors and get validation from the community through voting.

## Features

- Browse questions others have asked
- Vote whether you think behaviors are "Normal" or "Not Normal"
- Submit your own questions anonymously
- Filter questions by category
- Search for specific questions
- SEO-friendly URLs for better organic traffic

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Deployment**: Vercel (frontend), Render/Railway (backend), MongoDB Atlas

## Installation

### Prerequisites

- Node.js
- MongoDB

### Setup

1. Clone the repository
```
git clone <repository-url>
cd is-this-normal
```

2. Install server dependencies
```
npm install
```

3. Install client dependencies
```
npm run install-client
```

4. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/is-this-normal
```

### Running the Application

1. Run the MongoDB server
```
mongod
```

2. Seed the database with initial questions
```
node seed.js
```

3. Generate the sitemap (optional)
```
npm run generate-sitemap
```

4. Run the development server (both frontend and backend)
```
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Option 1: Full-Stack Deployment (Render, Heroku, or Railway)

1. Create a new web service on your preferred platform
2. Connect your GitHub repository
3. Set the following environment variables:
   - `NODE_ENV=production`
   - `PORT=5000` (or let the platform assign one)
   - `MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/is-this-normal?retryWrites=true&w=majority`
4. Set the build command to: `npm install && npm run heroku-postbuild`
5. Set the start command to: `npm start`
6. Deploy

### Option 2: Separate Deployments

#### Backend Deployment (Render/Railway)

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables (NODE_ENV, PORT, MONGO_URI)
4. Set the build command to: `npm install`
5. Set the start command to: `npm start`
6. Deploy

#### Frontend Deployment (Vercel/Netlify)

1. Connect your GitHub repository
2. Set the build command to: `cd client && npm install && npm run build`
3. Set the output directory to: `client/build`
4. Set environment variable: `REACT_APP_API_URL=https://your-backend-url.com`
5. Deploy

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account if you don't have one
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string from the Connect dialog
5. Replace `<username>` and `<password>` with your database user credentials
6. Add your connection string to the MONGO_URI environment variable

## License

MIT