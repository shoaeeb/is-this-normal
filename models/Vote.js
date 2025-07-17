const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  userIdentifier: {
    type: String,
    required: true
  },
  voteType: {
    type: String,
    enum: ['normal', 'notNormal'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one vote per user per question
VoteSchema.index({ questionId: 1, userIdentifier: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);