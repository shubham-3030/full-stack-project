import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  FileText,
  AlertCircle,
  BarChart2,
} from 'lucide-react';
import { blogAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';

const MyBlogs = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [deleteModal, setDeleteModal] = useState({ open: false, blogId: null });

  const fetchMyBlogs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await blogAPI.getAll({ author: user._id });
      if (res.data.success) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching user blogs:', err);
      setToast({ message: 'Failed to load your blogs', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBlogs();
  }, [user]);

  const handleDeleteConfirm = async () => {
    if (!deleteModal.blogId) return;
    try {
      const res = await blogAPI.delete(deleteModal.blogId);
      if (res.data.success) {
        setBlogs(blogs.filter((b) => b._id !== deleteModal.blogId));
        setToast({ message: 'Blog post deleted successfully', type: 'success' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete blog post';
      setToast({ message: msg, type: 'error' });
    } finally {
      setDeleteModal({ open: false, blogId: null });
    }
  };

  const totalWords = blogs.reduce((acc, b) => {
    return acc + (b.content ? b.content.trim().split(/\s+/).length : 0);
  }, 0);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 via-cyan-600 to-indigo-600 flex items-center justify-center shadow-md">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Creator Dashboard</h1>
            <p className="text-xs text-slate-500">Manage all articles published under your account</p>
          </div>
        </div>

        <Link
          to="/create-blog"
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Post</span>
        </Link>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Articles</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{blogs.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center border border-brand-200">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Words Written</p>
            <p className="text-3xl font-extrabold text-cyan-600 mt-1">{totalWords.toLocaleString()}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200">
            <BarChart2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Author Account</p>
            <p className="text-sm font-bold text-slate-900 mt-2 truncate max-w-[180px]">{user?.name}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Blogs List */}
      <main>
        {loading ? (
          <LoadingSkeleton />
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto my-8 border border-slate-200 shadow-sm">
            <BookOpen className="w-12 h-12 text-brand-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">You haven't written any blog posts yet</h3>
            <p className="text-slate-600 text-sm mt-2">
              Share your insights, code tutorials, and design tips with our reading community.
            </p>
            <Link
              to="/create-blog"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-semibold text-sm mt-6 hover:bg-brand-700 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write Your First Post</span>
            </Link>
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
              <h3 className="text-lg font-bold text-slate-900">Delete Post</h3>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to permanently delete this post? This action cannot be undone.
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

export default MyBlogs;
