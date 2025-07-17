const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  username: {
    type: String,
    default: 'Anonymous'
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);