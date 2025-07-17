const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const CommentVote = require('../models/CommentVote');
const Question = require('../models/Question');
const Filter = require('bad-words');

const filter = new Filter();

// @route   GET api/comments/:questionId
// @desc    Get comments for a question
// @access  Public
router.get('/:questionId', async (req, res) => {
  try {
    // Get sort method from query params (default to 'top')
    const sortMethod = req.query.sort || 'top';
    
    // Get all comments for the question
    let comments = await Comment.find({ 
      questionId: req.params.questionId 
    });
    
    // Create a map of parent comments and their children
    const commentMap = {};
    const rootComments = [];
    
    comments.forEach(comment => {
      // Initialize empty children array for each comment
      commentMap[comment._id] = {
        ...comment.toObject(),
        children: []
      };
      
      // Add to root comments if it's a top-level comment
      if (!comment.parentId) {
        rootComments.push(commentMap[comment._id]);
      }
    });
    
    // Build the comment tree
    comments.forEach(comment => {
      if (comment.parentId && commentMap[comment.parentId]) {
        commentMap[comment.parentId].children.push(commentMap[comment._id]);
      }
    });
    
    // Sort comments based on the requested method
    const sortComments = (comments) => {
      let sorted;
      
      switch (sortMethod) {
        case 'new':
          sorted = comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'old':
          sorted = comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case 'top':
        default:
          sorted = comments.sort((a, b) => b.score - a.score);
      }
      
      // Sort children recursively
      sorted.forEach(comment => {
        if (comment.children.length > 0) {
          comment.children = sortComments(comment.children);
        }
      });
      
      return sorted;
    };
    
    // Sort the root comments
    const sortedComments = sortComments(rootComments);
    
    res.json(sortedComments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/comments
// @desc    Add a comment to a question
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { questionId, parentId, text, username } = req.body;
    
    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ msg: 'Question not found' });
    }
    
    // If it's a reply, check if parent comment exists
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({ msg: 'Parent comment not found' });
      }
    }
    
    // Check for inappropriate content
    if (filter.isProfane(text)) {
      return res.status(400).json({ msg: 'Comment contains inappropriate content' });
    }
    
    // Create new comment
    const newComment = new Comment({
      questionId,
      parentId: parentId || null,
      text,
      username: username || 'Anonymous'
    });
    
    const comment = await newComment.save();
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/comments/vote
// @desc    Vote on a comment
// @access  Public
router.post('/vote', async (req, res) => {
  try {
    const { commentId, voteType, userIdentifier } = req.body;
    
    // Validate vote type
    if (voteType !== 'upvote' && voteType !== 'downvote') {
      return res.status(400).json({ msg: 'Invalid vote type' });
    }
    
    // Check if comment exists
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }
    
    // Check if user already voted
    const existingVote = await CommentVote.findOne({ commentId, userIdentifier });
    
    if (existingVote) {
      // If vote type is the same, remove the vote (toggle)
      if (existingVote.voteType === voteType) {
        await CommentVote.deleteOne({ _id: existingVote._id });
        
        // Update comment vote counts
        if (voteType === 'upvote') {
          comment.upvotes -= 1;
        } else {
          comment.downvotes -= 1;
        }
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        await existingVote.save();
        
        // Update comment vote counts
        if (voteType === 'upvote') {
          comment.upvotes += 1;
          comment.downvotes -= 1;
        } else {
          comment.upvotes -= 1;
          comment.downvotes += 1;
        }
      }
    } else {
      // Create new vote
      const newVote = new CommentVote({
        commentId,
        userIdentifier,
        voteType
      });
      
      await newVote.save();
      
      // Update comment vote counts
      if (voteType === 'upvote') {
        comment.upvotes += 1;
      } else {
        comment.downvotes += 1;
      }
    }
    
    // Update score
    comment.score = comment.upvotes - comment.downvotes;
    
    await comment.save();
    
    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/comments/vote/:commentId/:userIdentifier
// @desc    Check user's vote on a comment
// @access  Public
router.get('/vote/:commentId/:userIdentifier', async (req, res) => {
  try {
    const { commentId, userIdentifier } = req.params;
    
    const vote = await CommentVote.findOne({ commentId, userIdentifier });
    
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