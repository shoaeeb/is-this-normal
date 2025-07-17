const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['work', 'relationships', 'social', 'habits', 'health', 'family', 'other'],
    default: 'other'
  },
  normalVotes: {
    type: Number,
    default: 0
  },
  notNormalVotes: {
    type: Number,
    default: 0
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  normalPercentage: {
    type: Number,
    default: 0
  },
  isApproved: {
    type: Boolean,
    default: true // For seed data, we'll set to true. User submissions would default to false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create slug from question text
QuestionSchema.pre('save', function(next) {
  if (!this.isModified('text')) {
    return next();
  }
  
  try {
    // Create slug from question text
    this.slug = this.text
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^is-it-normal-to-/, '')
      .replace(/-+$/, '')
      .substring(0, 100);
      
    // Add timestamp to ensure uniqueness
    const timestamp = Date.now().toString().slice(-6);
    this.slug = `${this.slug}-${timestamp}`;
    
    console.log('Generated slug:', this.slug);
    next();
  } catch (err) {
    console.error('Error generating slug:', err);
    next(err);
  }
});

module.exports = mongoose.model('Question', QuestionSchema);