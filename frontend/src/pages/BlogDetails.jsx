import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Tag,
  AlertCircle,
  Share2,
  CheckCircle,
} from 'lucide-react';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await blogAPI.getById(id);
        if (res.data.success) {
          setBlog(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching blog details:', err);
        setError(err.response?.data?.message || 'Blog post not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const authorId = blog?.author?._id || blog?.author;
  const isOwner = user && (user._id === authorId || user._id === authorId?.toString());

  const handleDelete = async () => {
    try {
      const res = await blogAPI.delete(id);
      if (res.data.success) {
        setToast({ message: 'Blog deleted successfully', type: 'success' });
        setTimeout(() => {
          navigate('/');
        }, 1200);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete blog post';
      setToast({ message: msg, type: 'error' });
    } finally {
      setDeleteModal(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const wordCount = blog?.content ? blog.content.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = blog
    ? new Date(blog.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-xl mx-auto text-center">
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-md">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Post Not Found</h2>
          <p className="text-slate-600 text-sm mb-6">{error || "The blog post you are looking for does not exist."}</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Blogs</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Back button & Action Toolbar */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to blogs</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition shadow-xs"
          >
            {copied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied Link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>

          {isOwner && (
            <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
              <Link
                to={`/edit-blog/${blog._id}`}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
              <button
                onClick={() => setDeleteModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Post Article */}
      <article className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-md">
        {/* Category & Read Time header */}
        <div className="flex items-center space-x-4 mb-6">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
            {blog.category || 'General'}
          </span>
          <span className="flex items-center text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {readTimeMinutes} min read ({wordCount} words)
          </span>
        </div>

        {/* Blog Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {blog.title}
        </h1>

        {/* Author Details Banner */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-600 via-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-white text-base shadow-sm">
              {getInitials(blog.author?.name)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {blog.author?.name || 'Anonymous Author'}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{blog.author?.email}</p>
            </div>
          </div>

          <div className="text-xs text-slate-500 flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
            <span>Published on {formattedDate}</span>
          </div>
        </div>

        {/* Cover Image if present */}
        {blog.coverImage && (
          <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-auto max-h-[450px] object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div className="mt-10 text-slate-800 leading-relaxed text-base sm:text-lg space-y-6 whitespace-pre-wrap font-sans">
          {blog.content}
        </div>

        {/* Tags Footer */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-100 flex items-center space-x-2 flex-wrap gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center mr-2">
              <Tag className="w-3.5 h-3.5 mr-1" /> Tags:
            </span>
            {blog.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center space-x-3 text-rose-600 mb-4">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold text-slate-900">Delete Post</h3>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-900">"{blog.title}"</span>? This will permanently remove the post.
            </p>
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default BlogDetails;
