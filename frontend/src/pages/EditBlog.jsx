import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Edit3,
  ArrowLeft,
  Tag,
  Folder,
  Image as ImageIcon,
  Check,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const categories = ['Technology', 'Design', 'Development', 'Lifestyle', 'Tutorial', 'General'];

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    tags: '',
    coverImage: '',
    content: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notOwner, setNotOwner] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await blogAPI.getById(id);
        if (res.data.success) {
          const blog = res.data.data;
          const authorId = blog.author?._id || blog.author;

          // Check Ownership
          if (user && user._id !== authorId && user._id !== authorId?.toString()) {
            setNotOwner(true);
            setLoading(false);
            return;
          }

          setFormData({
            title: blog.title || '',
            category: blog.category || 'General',
            tags: blog.tags ? blog.tags.join(', ') : '',
            coverImage: blog.coverImage || '',
            content: blog.content || '',
          });
        }
      } catch (err) {
        console.error('Error loading blog for edit:', err);
        setError('Could not fetch blog details for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in both title and content.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await blogAPI.update(id, {
        title: formData.title.trim(),
        category: formData.category,
        tags: formData.tags,
        coverImage: formData.coverImage.trim(),
        content: formData.content,
      });

      if (res.data.success) {
        setToast({ message: 'Blog updated successfully!', type: 'success' });
        setTimeout(() => {
          navigate(`/blogs/${id}`);
        }, 1000);
      }
    } catch (err) {
      console.error('Error updating blog:', err);
      const msg = err.response?.data?.message || 'Failed to update blog post.';
      setError(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Fetching article data...</p>
        </div>
      </div>
    );
  }

  if (notOwner) {
    return (
      <div className="min-h-screen py-20 px-4 max-w-xl mx-auto text-center">
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-md">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-600 text-sm mb-6">
            You do not have authorization to edit this blog post because you are not the original author.
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Blogs</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="mb-8 flex items-center justify-between">
        <Link
          to={`/blogs/${id}`}
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Cancel & Return to Post</span>
        </Link>
        <span className="text-xs text-amber-700 font-semibold px-3 py-1 bg-amber-50 rounded-full border border-amber-200">
          Edit Mode
        </span>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
            <Edit3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Edit Blog Post</h1>
            <p className="text-xs text-slate-500">Update article title, category, tags, or content</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl glass-input text-base font-semibold focus:ring-2 focus:ring-brand-500 transition"
              required
            />
          </div>

          {/* Category & Tags Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 flex items-center">
                <Folder className="w-3.5 h-3.5 mr-1.5 text-brand-600" />
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm text-slate-800 focus:ring-2 focus:ring-brand-500 transition bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-white text-slate-800">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1.5 text-cyan-600" />
                Tags (Comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl glass-input text-sm focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2 flex items-center">
              <ImageIcon className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm focus:ring-2 focus:ring-brand-500 transition"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Article Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              className="w-full p-4 rounded-xl glass-input text-sm leading-relaxed focus:ring-2 focus:ring-brand-500 transition font-sans resize-y"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <Link
              to={`/blogs/${id}`}
              className="px-5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-md shadow-amber-500/20 disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update Post</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
