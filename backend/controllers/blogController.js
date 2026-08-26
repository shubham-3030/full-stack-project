const Blog = require('../models/Blog');

// @desc    Get all blog posts with search & category filters
// @route   GET /api/blogs
// @access  Public (or Logged-in per authorization rules)
const getAllBlogs = async (req, res) => {
  try {
    const { search, category, author } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (author) {
      query.author = author;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name email avatar bio')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    console.error('Error in getAllBlogs:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching blogs',
    });
  }
};

// @desc    Get single blog post by ID
// @route   GET /api/blogs/:id
// @access  Public
const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate(
      'author',
      'name email avatar bio'
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error('Error in getBlogById:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found (Invalid ID format)',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error retrieving blog',
    });
  }
};

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private (Authenticated users only)
const createBlog = async (req, res) => {
  try {
    const { title, content, category, tags, coverImage } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and content for the blog post',
      });
    }

    // Convert tags if passed as comma separated string
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const blog = await Blog.create({
      title,
      content,
      category: category || 'General',
      tags: parsedTags || [],
      coverImage: coverImage || '',
      author: req.user._id,
    });

    const populatedBlog = await Blog.findById(blog._id).populate(
      'author',
      'name email avatar bio'
    );

    return res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: populatedBlog,
    });
  } catch (error) {
    console.error('Error in createBlog:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating blog',
    });
  }
};

// @desc    Update a blog post (Ownership verification enforced)
// @route   PUT /api/blogs/:id
// @access  Private (Blog Owner only)
const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Strict Backend Ownership Check
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to update another user\'s blog post',
      });
    }

    const { title, content, category, tags, coverImage } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (coverImage !== undefined) blog.coverImage = coverImage;

    if (tags !== undefined) {
      if (typeof tags === 'string') {
        blog.tags = tags.split(',').map((t) => t.trim()).filter(Boolean);
      } else {
        blog.tags = tags;
      }
    }

    const updatedBlog = await blog.save();
    const populatedBlog = await Blog.findById(updatedBlog._id).populate(
      'author',
      'name email avatar bio'
    );

    return res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: populatedBlog,
    });
  } catch (error) {
    console.error('Error in updateBlog:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found (Invalid ID format)',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating blog',
    });
  }
};

// @desc    Delete a blog post (Ownership verification enforced)
// @route   DELETE /api/blogs/:id
// @access  Private (Blog Owner only)
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
      });
    }

    // Strict Backend Ownership Check
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to delete another user\'s blog post',
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Error in deleteBlog:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found (Invalid ID format)',
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting blog',
    });
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
