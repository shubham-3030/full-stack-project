const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

// Public Reading Endpoints - Allows all visitors to view published articles
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Protected Blog Management Endpoints (Require Authentication & Ownership Validation)
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
