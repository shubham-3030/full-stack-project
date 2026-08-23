import React, { useState, useEffect } from 'react';
import { Mail, Calendar, BookOpen, PenSquare, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { blogAPI } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (user?._id) {
        try {
          const res = await blogAPI.getAll({ author: user._id });
          if (res.data.success) {
            setPostCount(res.data.data.length);
          }
        } catch (err) {
          console.error('Error fetching user stats:', err);
        }
      }
    };

    fetchUserStats();
  }, [user]);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : 'Member';

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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md relative overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        {/* Header Profile Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-brand-600 via-cyan-500 to-indigo-600 flex items-center justify-center font-extrabold text-white text-3xl shadow-md shrink-0">
            {getInitials(user?.name)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              <h1 className="text-3xl font-extrabold text-slate-900">{user?.name}</h1>
              <ShieldCheck className="w-5 h-5 text-brand-600" />
            </div>
            <p className="text-sm text-slate-600 flex items-center justify-center sm:justify-start space-x-1">
              <Mail className="w-4 h-4 mr-1 text-slate-400" />
              <span>{user?.email}</span>
            </p>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start space-x-1 pt-1">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
              <span>Member since {joinDate}</span>
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
          <p className="font-semibold text-slate-900 mb-1">About Author</p>
          <p>{user?.bio || 'Blog author and developer sharing creative ideas on Chronicle.'}</p>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-2xl font-extrabold text-brand-600">{postCount}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Articles Published</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-2xl font-extrabold text-emerald-600">Active</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Account Status</p>
          </div>
        </div>

        {/* Action Links */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-center sm:justify-end space-x-3">
          <Link
            to="/my-blogs"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold border border-slate-200 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Manage My Posts</span>
          </Link>
          <Link
            to="/create-blog"
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-sm transition"
          >
            <PenSquare className="w-4 h-4" />
            <span>Write New Article</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
