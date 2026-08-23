const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      trim: true,
      maxlength: [150, 'Title cannot be more than 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please add blog content'],
    },
    category: {
      type: String,
      default: 'General',
      enum: ['Technology', 'Design', 'Development', 'Lifestyle', 'Tutorial', 'General'],
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: '',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Blog must belong to an author'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality on title and content
BlogSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Blog', BlogSchema);
