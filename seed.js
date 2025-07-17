const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('./models/Question');

// Load environment variables
dotenv.config();

// Sample questions data
const questions = [
  {
    text: 'Is it normal to feel anxious when someone is watching you work?',
    slug: 'feel-anxious-when-someone-is-watching-you-work',
    category: 'work',
    normalVotes: 85,
    notNormalVotes: 15,
    totalVotes: 100,
    normalPercentage: 85,
    isApproved: true
  },
  {
    text: 'Is it normal to rehearse conversations in your head?',
    slug: 'rehearse-conversations-in-your-head',
    category: 'social',
    normalVotes: 92,
    notNormalVotes: 8,
    totalVotes: 100,
    normalPercentage: 92,
    isApproved: true
  },
  {
    text: 'Is it normal to avoid making phone calls?',
    slug: 'avoid-making-phone-calls',
    category: 'social',
    normalVotes: 78,
    notNormalVotes: 22,
    totalVotes: 100,
    normalPercentage: 78,
    isApproved: true
  },
  {
    text: 'Is it normal to talk to yourself?',
    slug: 'talk-to-yourself',
    category: 'habits',
    normalVotes: 89,
    notNormalVotes: 11,
    totalVotes: 100,
    normalPercentage: 89,
    isApproved: true
  },
  {
    text: 'Is it normal to forget what you were about to say mid-sentence?',
    slug: 'forget-what-you-were-about-to-say-mid-sentence',
    category: 'health',
    normalVotes: 82,
    notNormalVotes: 18,
    totalVotes: 100,
    normalPercentage: 82,
    isApproved: true
  },
  {
    text: 'Is it normal to feel like you never have enough time?',
    slug: 'feel-like-you-never-have-enough-time',
    category: 'work',
    normalVotes: 75,
    notNormalVotes: 25,
    totalVotes: 100,
    normalPercentage: 75,
    isApproved: true
  },
  {
    text: 'Is it normal to worry about what others think of you?',
    slug: 'worry-about-what-others-think-of-you',
    category: 'social',
    normalVotes: 88,
    notNormalVotes: 12,
    totalVotes: 100,
    normalPercentage: 88,
    isApproved: true
  },
  {
    text: 'Is it normal to feel uncomfortable with compliments?',
    slug: 'feel-uncomfortable-with-compliments',
    category: 'social',
    normalVotes: 72,
    notNormalVotes: 28,
    totalVotes: 100,
    normalPercentage: 72,
    isApproved: true
  },
  {
    text: 'Is it normal to check if you locked the door multiple times?',
    slug: 'check-if-you-locked-the-door-multiple-times',
    category: 'habits',
    normalVotes: 80,
    notNormalVotes: 20,
    totalVotes: 100,
    normalPercentage: 80,
    isApproved: true
  },
  {
    text: 'Is it normal to feel like an impostor at work?',
    slug: 'feel-like-an-impostor-at-work',
    category: 'work',
    normalVotes: 83,
    notNormalVotes: 17,
    totalVotes: 100,
    normalPercentage: 83,
    isApproved: true
  }
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/is-this-normal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
    
    // Clear existing data
    await Question.deleteMany({});
    console.log('Existing questions cleared');
    
    // Insert new data
    await Question.insertMany(questions);
    console.log('Sample questions inserted successfully');
    
    // Disconnect
    mongoose.disconnect();
    console.log('MongoDB Disconnected');
    
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();