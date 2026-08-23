import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Edit3, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BlogCard = ({ blog, onDelete }) => {
  const { user } = useAuth();

  const authorId = blog.author?._id || blog.author;
  const isOwner = user && (user._id === authorId || user._id === authorId?.toString());

  const wordCount = blog.content ? blog.content.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const categoryColors = {
    Technology: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    Design: 'bg-purple-50 text-purple-700 border-purple-200',
    Development: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Lifestyle: 'bg-amber-50 text-amber-700 border-amber-200',
    Tutorial: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    General: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <article className="glass-card rounded-2xl p-6 flex flex-col justify-between h-full group relative bg-white">
      <div className="space-y-4">
        {/* Top Header: Category & Read Time */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              categoryColors[blog.category] || categoryColors.General
            }`}
          >
            {blog.category || 'General'}
          </span>
          <div className="flex items-center space-x-1 text-slate-500 text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{readTimeMinutes} min read</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2">
          <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
        </h3>

        {/* Content Excerpt */}
        <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
          {blog.content}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {blog.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200"
              >
                <Tag className="w-2.5 h-2.5 mr-1 text-slate-400" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info: Author details & Action Buttons */}
      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
        {/* Author Avatar & Info */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center font-bold text-white text-xs shadow-sm">
            {getInitials(blog.author?.name)}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">
              {blog.author?.name || 'Anonymous Author'}
            </p>
            <p className="text-[11px] text-slate-500 flex items-center mt-0.5">
              <Calendar className="w-3 h-3 mr-1 text-slate-400" />
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Actions (Read link or Edit/Delete if Owner) */}
        <div className="flex items-center space-x-2">
          {isOwner ? (
            <>
              <Link
                to={`/edit-blog/${blog._id}`}
                className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                title="Edit blog post"
              >
                <Edit3 className="w-4 h-4" />
              </Link>
              <button
                onClick={() => onDelete && onDelete(blog._id)}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                title="Delete blog post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : null}

          <Link
            to={`/blogs/${blog._id}`}
            className="inline-flex items-center text-xs font-semibold text-brand-600 hover:text-brand-700 pl-2 group-hover:translate-x-1 transition-transform"
          >
            <span>Read</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
