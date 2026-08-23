import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PenSquare,
  ArrowLeft,
  Tag,
  Folder,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { blogAPI } from '../services/api';
import Toast from '../components/Toast';

const categories = ['Technology', 'Design', 'Development', 'Lifestyle', 'Tutorial', 'General'];

const CreateBlog = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'General',
    tags: '',
    coverImage: '',
    content: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const wordCount = formData.content.trim()
    ? formData.content.trim().split(/\s+/).length
    : 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Please provide a title for your blog post.');
      return;
    }

    if (!formData.content.trim()) {
      setError('Blog content cannot be empty.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await blogAPI.create({
        title: formData.title.trim(),
        category: formData.category,
        tags: formData.tags,
        coverImage: formData.coverImage.trim(),
        content: formData.content,
      });

      if (res.data.success) {
        setToast({ message: 'Blog post created successfully!', type: 'success' });
        setTimeout(() => {
          navigate(`/blogs/${res.data.data._id}`);
        }, 1000);
      }
    } catch (err) {
      console.error('Error creating blog:', err);
      const msg = err.response?.data?.message || 'Failed to create blog post. Please try again.';
      setError(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      <div className="mb-8 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Cancel & Return</span>
        </Link>
        <span className="text-xs text-brand-700 font-semibold px-3 py-1 bg-brand-50 rounded-full border border-brand-200">
          New Article
        </span>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center shadow-md">
            <PenSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Create Blog Post</h1>
            <p className="text-xs text-slate-500">Share your story and technical insights with the community</p>
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
              placeholder="e.g. Mastered Modern Full-Stack Development with React & Node.js"
              className="w-full px-4 py-3 rounded-xl glass-input text-base font-semibold placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition"
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
                placeholder="react, webdev, express, mongodb"
                className="w-full px-4 py-3 rounded-xl glass-input text-sm placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition"
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
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 rounded-xl glass-input text-sm placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition"
            />
          </div>

          {/* Content Textarea */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Article Content <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">
                {wordCount} words | {formData.content.length} characters
              </span>
            </div>
            <textarea
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your article content here..."
              className="w-full p-4 rounded-xl glass-input text-sm leading-relaxed placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition font-sans resize-y"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <Link
              to="/"
              className="px-5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all"
            >
              {submitting ? (
                <span>Publishing Post...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Article</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
