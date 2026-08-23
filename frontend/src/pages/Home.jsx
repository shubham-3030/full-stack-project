import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, PlusCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogAPI } from '../services/api';
import BlogCard from '../components/BlogCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';

const categories = ['All', 'Technology', 'Design', 'Development', 'Lifestyle', 'Tutorial', 'General'];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ open: false, blogId: null });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const res = await blogAPI.getAll(params);
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setToast({
        message: 'Failed to load blogs. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBlogs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedCategory]);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.blogId) return;
    try {
      const res = await blogAPI.delete(deleteModal.blogId);
      if (res.data.success) {
        setBlogs(blogs.filter((b) => b._id !== deleteModal.blogId));
        setToast({ message: 'Blog post deleted successfully', type: 'success' });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete blog post';
      setToast({ message: errorMsg, type: 'error' });
    } finally {
      setDeleteModal({ open: false, blogId: null });
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Toast feedback */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Hero Banner Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Full-Stack Blog Platform</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-tight">
          Explore Insights & <span className="bg-gradient-to-r from-brand-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">Creative Ideas</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Discover original articles written by developers, designers, and tech creators across the world.
        </p>

        {/* Search & Action Toolbar */}
        <div className="mt-10 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, content or tags..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl glass-input text-sm placeholder-slate-400 shadow-sm transition"
            />
          </div>

          {isAuthenticated ? (
            <Link
              to="/create-blog"
              className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Blog</span>
            </Link>
          ) : (
            <Link
              to="/register"
              className="w-full sm:w-auto shrink-0 flex items-center justify-center space-x-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-sm transition"
            >
              <span>Join Chronicle</span>
            </Link>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="mt-8 flex items-center justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Main Blog List Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <span>Published Blogs</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
              {blogs.length}
            </span>
          </h2>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto my-12 border border-slate-200 shadow-sm">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-brand-600">
              <Filter className="w-8 h-8 text-brand-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No blog posts found</h3>
            <p className="text-slate-600 text-sm mt-2">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search criteria or category filter.'
                : 'Be the first creator to share your stories on Chronicle!'}
            </p>
            {isAuthenticated ? (
              <Link
                to="/create-blog"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold mt-6 hover:bg-brand-700 transition shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Write a Blog</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold mt-6 hover:bg-slate-800 transition shadow-sm"
              >
                <span>Log in to create blogs</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onDelete={(id) => setDeleteModal({ open: true, blogId: id })}
              />
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-600 mb-4">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-slate-900">Delete Blog Post</h3>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to permanently delete this blog post? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteModal({ open: false, blogId: null })}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
