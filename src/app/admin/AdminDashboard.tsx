'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { categoryLabels, Category, Selection } from '@/lib/types';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  categories_count: number;
  total_visited: number;
  total_bucket_list: number;
}

interface Pagination {
  page: number;
  limit: number;
  count: number;
  hasMore: boolean;
}

interface UsersData {
  users: User[];
  pagination: Pagination;
}

interface CategoryStats {
  category: Category;
  visited: number;
  bucketList: number;
  total: number;
}

interface UserDetail {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  selections: Record<string, Selection[]>;
  categoryStats: CategoryStats[];
  totalVisited: number;
  totalBucketList: number;
}

export default function AdminDashboard() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [usersData, setUsersData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [userToView, setUserToView] = useState<User | null>(null);
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const pageSize = 50;

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/users?page=${currentPage}&limit=${pageSize}`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsersData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [currentPage]);

  // Fetch user detail when userToView changes
  useEffect(() => {
    async function fetchUserDetail() {
      if (!userToView) {
        setUserDetail(null);
        setSelectedCategory(null);
        return;
      }

      setLoadingDetail(true);
      try {
        const response = await fetch(`/api/admin/users/${userToView.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setUserDetail(data);
        // Auto-select first category with data
        if (data.categoryStats.length > 0) {
          setSelectedCategory(data.categoryStats[0].category);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user details');
        setUserToView(null);
      } finally {
        setLoadingDetail(false);
      }
    }

    fetchUserDetail();
  }, [userToView]);

  const filteredUsers = usersData?.users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userToDelete.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      // Remove user from local state
      setUsersData(prev => prev ? {
        ...prev,
        users: prev.users.filter(u => u.id !== userToDelete.id),
        pagination: { ...prev.pagination, count: prev.pagination.count - 1 },
      } : null);

      setUserToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  // CSV Export function
  const handleExportCSV = () => {
    if (!usersData?.users) return;

    const headers = ['ID', 'Email', 'Joined', 'Last Sign In', 'Categories', 'Visited Count', 'Bucket List Count'];
    const csvContent = [
      headers.join(','),
      ...usersData.users.map(u => [
        u.id,
        `"${u.email}"`, // Quote email to handle special characters
        u.created_at,
        u.last_sign_in_at || '',
        u.categories_count,
        u.total_visited,
        u.total_bucket_list
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get selections for a category from user detail
  const getSelectionsForCategory = (category: Category) => {
    if (!userDetail?.selections) return { visited: [], bucketList: [] };
    const items = userDetail.selections[category] || [];
    const activeItems = items.filter(item => !item.deleted);
    return {
      visited: activeItems.filter(item => item.status === 'visited'),
      bucketList: activeItems.filter(item => item.status === 'bucketList'),
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 transition-transform group-hover:scale-110 duration-200">
              <Image src="/logo.svg" alt="See Every Place Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-primary-900 dark:text-white leading-none">
                SeeEvery<span className="text-accent-500">.</span>Place<span className="text-[10px] align-super text-primary-400">TM</span>
              </h1>
              <span className="text-[10px] text-primary-500 dark:text-primary-400 font-medium tracking-wider uppercase">
                Admin Dashboard
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-primary-600 dark:text-primary-300">
            Manage users and access admin tools.
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          <Link
            href="/admin/analytics"
            className="flex items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-900 dark:text-white">Analytics</h2>
              <p className="text-sm text-primary-600 dark:text-primary-400">View statistics</p>
            </div>
            <svg className="w-5 h-5 text-primary-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/admin/suggestions"
            className="flex items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-900 dark:text-white">Suggestions</h2>
              <p className="text-sm text-primary-600 dark:text-primary-400">Review ideas</p>
            </div>
            <svg className="w-5 h-5 text-primary-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/admin/data-health"
            className="flex items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-900 dark:text-white">Data Health</h2>
              <p className="text-sm text-primary-600 dark:text-primary-400">Validate data</p>
            </div>
            <svg className="w-5 h-5 text-primary-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-900 dark:text-white">Settings</h2>
              <p className="text-sm text-primary-600 dark:text-primary-400">Banners & Logs</p>
            </div>
            <svg className="w-5 h-5 text-primary-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            href="/admin/newsletter"
            className="flex items-center gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 hover:shadow-md transition-shadow group"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary-900 dark:text-white">Newsletter</h2>
              <p className="text-sm text-primary-600 dark:text-primary-400">Email campaigns</p>
            </div>
            <svg className="w-5 h-5 text-primary-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* User Management */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
          <div className="p-6 border-b border-black/5 dark:border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-primary-900 dark:text-white">User Management</h2>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  {usersData ? `Page ${usersData.pagination.page} (${usersData.pagination.count} users)` : 'Loading...'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full sm:w-64 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <button
                  onClick={handleExportCSV}
                  disabled={!usersData?.users?.length}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  title="Export users to CSV"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                {error}
              </div>
            </div>
          )}

          {usersData && !loading && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                        Last Sign In
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                        Categories
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                        Visited
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                        Bucket List
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-primary-600 dark:text-primary-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-100 dark:divide-slate-700">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-primary-500 dark:text-primary-400">
                          {searchTerm ? 'No users found matching your search.' : 'No users yet.'}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-primary-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-primary-900 dark:text-white">{user.email}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-primary-600 dark:text-primary-400">{formatDate(user.created_at)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-primary-600 dark:text-primary-400">{formatDate(user.last_sign_in_at)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-primary-900 dark:text-white">{user.categories_count}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-green-600 dark:text-green-400 font-medium">{user.total_visited}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">{user.total_bucket_list}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setUserToView(user)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                title="View user details"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setUserToDelete(user)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                                title="Delete user"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="px-6 py-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 bg-primary-50 dark:bg-slate-700 rounded-lg hover:bg-primary-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-primary-600 dark:text-primary-400">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!usersData.pagination.hasMore}
                  className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 bg-primary-50 dark:bg-slate-700 rounded-lg hover:bg-primary-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-white mb-2">
              Delete User
            </h3>
            <p className="text-primary-600 dark:text-primary-300 mb-4">
              Are you sure you want to delete <strong className="text-primary-900 dark:text-white">{userToDelete.email}</strong>? This will permanently remove their account and all their data. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 bg-primary-100 dark:bg-slate-700 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete User'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {userToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-primary-900 dark:text-white">
                  User Details
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                  {userToView.email}
                </p>
              </div>
              <button
                onClick={() => setUserToView(null)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingDetail ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
                </div>
              ) : userDetail ? (
                <div className="space-y-6">
                  {/* User Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-primary-50 dark:bg-slate-700/50 rounded-xl p-4">
                      <p className="text-sm text-primary-600 dark:text-primary-400">Joined</p>
                      <p className="text-lg font-semibold text-primary-900 dark:text-white">{formatDate(userDetail.created_at)}</p>
                    </div>
                    <div className="bg-primary-50 dark:bg-slate-700/50 rounded-xl p-4">
                      <p className="text-sm text-primary-600 dark:text-primary-400">Last Sign In</p>
                      <p className="text-lg font-semibold text-primary-900 dark:text-white">{formatDate(userDetail.last_sign_in_at)}</p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                      <p className="text-sm text-green-700 dark:text-green-400">Total Visited</p>
                      <p className="text-lg font-semibold text-green-800 dark:text-green-300">{userDetail.totalVisited}</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                      <p className="text-sm text-amber-700 dark:text-amber-400">Total Bucket List</p>
                      <p className="text-lg font-semibold text-amber-800 dark:text-amber-300">{userDetail.totalBucketList}</p>
                    </div>
                  </div>

                  {/* Category Breakdown */}
                  {userDetail.categoryStats.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-primary-900 dark:text-white">Category Breakdown</h4>

                      {/* Category Pills */}
                      <div className="flex flex-wrap gap-2">
                        {userDetail.categoryStats.map((stat) => (
                          <button
                            key={stat.category}
                            onClick={() => setSelectedCategory(stat.category)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              selectedCategory === stat.category
                                ? 'bg-primary-600 text-white'
                                : 'bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            {categoryLabels[stat.category]}
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-xs">
                              {stat.visited + stat.bucketList}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Selected Category Details */}
                      {selectedCategory && (
                        <div className="bg-primary-50 dark:bg-slate-700/30 rounded-xl p-4">
                          <h5 className="font-semibold text-primary-900 dark:text-white mb-3">
                            {categoryLabels[selectedCategory]}
                          </h5>
                          {(() => {
                            const { visited, bucketList } = getSelectionsForCategory(selectedCategory);
                            return (
                              <div className="grid md:grid-cols-2 gap-4">
                                {/* Visited */}
                                <div>
                                  <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Visited ({visited.length})
                                  </p>
                                  {visited.length > 0 ? (
                                    <div className="max-h-48 overflow-y-auto space-y-1">
                                      {visited.map((item) => (
                                        <div key={item.id} className="text-sm text-primary-700 dark:text-primary-300 bg-white dark:bg-slate-800 rounded px-2 py-1">
                                          {item.id}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-primary-500 dark:text-primary-400">None</p>
                                  )}
                                </div>

                                {/* Bucket List */}
                                <div>
                                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Bucket List ({bucketList.length})
                                  </p>
                                  {bucketList.length > 0 ? (
                                    <div className="max-h-48 overflow-y-auto space-y-1">
                                      {bucketList.map((item) => (
                                        <div key={item.id} className="text-sm text-primary-700 dark:text-primary-300 bg-white dark:bg-slate-800 rounded px-2 py-1">
                                          {item.id}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-primary-500 dark:text-primary-400">None</p>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-primary-500 dark:text-primary-400">
                      This user has not tracked any places yet.
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-black/5 dark:border-white/10 bg-primary-50 dark:bg-slate-700/50">
              <div className="flex justify-end">
                <button
                  onClick={() => setUserToView(null)}
                  className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 bg-white dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg hover:bg-primary-100 dark:hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
