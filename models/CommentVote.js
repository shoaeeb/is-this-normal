const mongoose = require('mongoose');

const CommentVoteSchema = new mongoose.Schema({
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  },
  userIdentifier: {
    type: String,
    required: true
  },
  voteType: {
    type: String,
    enum: ['upvote', 'downvote'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one vote per user per comment
CommentVoteSchema.index({ commentId: 1, userIdentifier: 1 }, { unique: true });

module.exports = mongoose.model('CommentVote', CommentVoteSchema);