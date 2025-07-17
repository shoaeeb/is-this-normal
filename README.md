# Is This Normal?

A platform for anonymous validation of behaviors and situations. Users can submit questions about their habits, thoughts, or behaviors and get validation from the community through voting.

![Is This Normal Screenshot](https://is-this-normal.onrender.com/screenshot.png)

## Live Demo

Visit the live application: [Is This Normal?](https://is-this-normal.onrender.com)

## Features

- **Anonymous Question Submission**: Ask questions without creating an account
- **Community Voting**: Users can vote whether behaviors are "Normal" or "Not Normal"
- **Categories**: Filter questions by categories like work, relationships, social, etc.
- **Search Functionality**: Find specific questions using keywords
- **Comments & Discussion**: Engage in conversations about each question
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Dark Mode**: Toggle between light and dark themes
- **SEO Optimized**: Dynamic meta tags, sitemap, and search engine friendly URLs

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- CSS for styling
- React Helmet for SEO

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- RESTful API architecture

### Deployment
- Render for hosting (full-stack deployment)
- MongoDB Atlas for database
- Google Analytics for user tracking

## Local Development

### Prerequisites
- Node.js (v14+)
- MongoDB

### Setup

1. Clone the repository
```bash
git clone <repository-url>
cd is-this-normal
```

2. Install server dependencies
```bash
npm install
```

3. Install client dependencies
```bash
npm run install-client
```

4. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/is-this-normal
BASE_URL=http://localhost:3000
GA_TRACKING_ID=your-ga-tracking-id
```

### Running the Application

1. Start MongoDB
```bash
mongod
```

2. Generate the sitemap (optional)
```bash
npm run generate-sitemap
```

3. Run the development server (both frontend and backend)
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application is configured for deployment on Render. See [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md) for detailed instructions.

## SEO & Analytics

This project includes:
- Dynamic meta tags using React Helmet
- Sitemap generation
- Google Analytics integration
- SEO-friendly URLs

For more details, see [SEO_ANALYTICS.md](./SEO_ANALYTICS.md).

## Monetization

Several revenue generation strategies are available without relying on traditional ads or subscriptions:

- **Contextual Affiliate Marketing**: Recommend relevant products based on question categories
- **Premium API Access**: Offer paid API access to researchers and developers
- **Sponsored Expert Answers**: Allow businesses or experts to provide sponsored insights
- **Data Insights & Reports**: Sell anonymized trend reports to businesses
- **Virtual Goods & Tipping**: Enable users to purchase awards or tip content creators
- **White-Label Solutions**: Offer customized versions for companies' internal use
- **Professional Partnerships**: Partner with mental health professionals for referrals

For implementation details, see [MONETIZATION.md](./docs/MONETIZATION.md).

## Project Structure

```
is-this-normal/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # React components
│       ├── context/        # Context providers
│       ├── utils/          # Utility functions
│       └── App.js          # Main App component
├── models/                 # Mongoose models
├── routes/                 # Express routes
├── server/                 # Server utilities
├── .env                    # Environment variables
└── server.js              # Express server entry point
```

## License

MIT

## Contact

For questions or feedback, please open an issue on the repository.