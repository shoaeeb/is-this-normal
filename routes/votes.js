const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Vote = require('../models/Vote');

// @route   POST api/votes
// @desc    Vote on a question
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { questionId, voteType, userIdentifier } = req.body;
    
    // Validate vote type
    if (voteType !== 'normal' && voteType !== 'notNormal') {
      return res.status(400).json({ msg: 'Invalid vote type' });
    }
    
    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    
    // Check if user already voted
    const existingVote = await Vote.findOne({ questionId, userIdentifier });
    
    if (existingVote) {
      // If vote type is the same, return error
      if (existingVote.voteType === voteType) {
        return res.status(400).json({ msg: 'You already voted this way' });
      }
      
      // Update existing vote
      existingVote.voteType = voteType;
      await existingVote.save();
      
      // Update question vote counts
      if (voteType === 'normal') {
        question.normalVotes += 1;
        question.notNormalVotes -= 1;
      } else {
        question.normalVotes -= 1;
        question.notNormalVotes += 1;
      }
    } else {
      // Create new vote
      const newVote = new Vote({
        questionId,
        userIdentifier,
        voteType
      });
      
      await newVote.save();
      
      // Update question vote counts
      if (voteType === 'normal') {
        question.normalVotes += 1;
      } else {
        question.notNormalVotes += 1;
      }
    }
    
    // Update total votes and percentage
    question.totalVotes = question.normalVotes + question.notNormalVotes;
    question.normalPercentage = question.totalVotes > 0 
      ? Math.round((question.normalVotes / question.totalVotes) * 100) 
      : 0;
    
    await question.save();
    
    res.json(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/votes/check/:questionId/:userIdentifier
// @desc    Check if user has voted on a question
// @access  Public
router.get('/check/:questionId/:userIdentifier', async (req, res) => {
  try {
    const { questionId, userIdentifier } = req.params;
    
    const vote = await Vote.findOne({ questionId, userIdentifier });
    
    if (!vote) {
      return res.json({ hasVoted: false });
    }
    
    res.json({
      hasVoted: true,
      voteType: vote.voteType
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;