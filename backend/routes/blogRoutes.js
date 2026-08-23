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

// Per assignment authorization matrix: Read blogs = Logged-in users only
router.get('/', protect, getAllBlogs);
router.get('/:id', protect, getBlogById);

// Protected routes (Require Authentication & Ownership validation)
router.post('/', protect, createBlog);
router.put('/:id', protect, updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
