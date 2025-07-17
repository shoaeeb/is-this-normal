const express = require('express');
const router = express.Router();
const Filter = require('bad-words');
const Question = require('../models/Question');

const filter = new Filter();

// @route   GET api/questions
// @desc    Get all questions with pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const questions = await Question.find({ isApproved: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Question.countDocuments({ isApproved: true });
    
    res.json({
      questions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalQuestions: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/questions/:slug
// @desc    Get question by slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const question = await Question.findOne({ 
      slug: req.params.slug,
      isApproved: true 
    });
    
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/questions
// @desc    Create a question
// @access  Public
router.post('/', async (req, res) => {
  try {
    let { text, category } = req.body;
    
    // Format question text
    if (!text.toLowerCase().startsWith('is it normal to')) {
      text = `Is it normal to ${text}`;
    }
    
    // Check for inappropriate content
    if (filter.isProfane(text)) {
      return res.status(400).json({ msg: 'Question contains inappropriate content' });
    }
    
    // Generate slug from question text
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^is-it-normal-to-/, '')
      .replace(/-+$/, '')
      .substring(0, 100);
    
    // Create new question
    const newQuestion = new Question({
      text,
      slug,
      category: category || 'other',
      isApproved: true // Auto-approve questions for now
    });
    
    const question = await newQuestion.save();
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/questions/category/:category
// @desc    Get questions by category with pagination
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const questions = await Question.find({ 
      category: req.params.category,
      isApproved: true 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
    const total = await Question.countDocuments({ 
      category: req.params.category,
      isApproved: true 
    });
    
    res.json({
      questions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalQuestions: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/questions/search/:query
// @desc    Search questions with pagination
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Clean up the search query
    const searchQuery = req.params.query
      .toLowerCase()
      .replace(/^is\s+it\s+normal\s+to\s+/i, '') // Remove "is it normal to" prefix if present
      .trim();
    
    // Create search terms by splitting the query
    const searchTerms = searchQuery.split(/\s+/).filter(term => term.length > 2);
    
    // If no valid search terms, return empty array
    if (searchTerms.length === 0) {
      return res.json({
        questions: [],
        currentPage: 1,
        totalPages: 0,
        totalQuestions: 0
      });
    }
    
    // Create a regex pattern that matches any of the search terms
    const searchPattern = searchTerms.map(term => 
      `(?=.*${term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`
    ).join('');
    
    const searchRegex = new RegExp(searchPattern, 'i');
    
    // Find questions that match the search pattern with pagination
    const questions = await Question.find({ 
      text: searchRegex,
      isApproved: true 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
    // Count total matching questions
    const total = await Question.countDocuments({ 
      text: searchRegex,
      isApproved: true 
    });
    
    res.json({
      questions,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalQuestions: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;