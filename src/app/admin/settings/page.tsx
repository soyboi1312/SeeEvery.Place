'use client';

import { useState, useEffect } from 'react';

interface Banner {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  link_text: string | null;
  link_url: string | null;
  is_active: boolean;
  starts_at: string;
  ends_at: string | null;
  created_by: string;
  created_at: string;
}

interface AdminLog {
  id: string;
  admin_email: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

type Tab = 'banners' | 'logs';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('banners');

  // Banner state
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [bannerForm, setBannerForm] = useState({
    message: '',
    type: 'info' as Banner['type'],
    link_text: '',
    link_url: '',
    is_active: true,
    ends_at: '',
  });
  const [savingBanner, setSavingBanner] = useState(false);

  // Logs state
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [logsPage, setLogsPage] = useState(1);
  const [hasMoreLogs, setHasMoreLogs] = useState(false);

  // Fetch banners
  useEffect(() => {
    async function fetchBanners() {
      setLoadingBanners(true);
      try {
        const response = await fetch('/api/admin/banners');
        if (response.ok) {
          const data = await response.json();
          setBanners(data.banners || []);
        }
      } catch (error) {
        console.error('Failed to fetch banners:', error);
      } finally {
        setLoadingBanners(false);
      }
    }
    fetchBanners();
  }, []);

  // Fetch logs
  useEffect(() => {
    async function fetchLogs() {
      setLoadingLogs(true);
      try {
        const response = await fetch(`/api/admin/logs?page=${logsPage}&limit=50`);
        if (response.ok) {
          const data = await response.json();
          setLogs(data.logs || []);
          setHasMoreLogs(data.pagination?.hasMore || false);
        }
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoadingLogs(false);
      }
    }
    fetchLogs();
  }, [logsPage]);

  const resetBannerForm = () => {
    setBannerForm({
      message: '',
      type: 'info',
      link_text: '',
      link_url: '',
      is_active: true,
      ends_at: '',
    });
    setEditingBanner(null);
    setShowBannerForm(false);
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setBannerForm({
      message: banner.message,
      type: banner.type,
      link_text: banner.link_text || '',
      link_url: banner.link_url || '',
      is_active: banner.is_active,
      ends_at: banner.ends_at ? banner.ends_at.split('T')[0] : '',
    });
    setShowBannerForm(true);
  };

  const handleSaveBanner = async () => {
    if (!bannerForm.message.trim()) return;

    setSavingBanner(true);
    try {
      const payload = {
        ...(editingBanner && { id: editingBanner.id }),
        message: bannerForm.message,
        type: bannerForm.type,
        link_text: bannerForm.link_text || null,
        link_url: bannerForm.link_url || null,
        is_active: bannerForm.is_active,
        ends_at: bannerForm.ends_at ? new Date(bannerForm.ends_at).toISOString() : null,
      };

      const response = await fetch('/api/admin/banners', {
        method: editingBanner ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (editingBanner) {
          setBanners(prev => prev.map(b => b.id === data.banner.id ? data.banner : b));
        } else {
          setBanners(prev => [data.banner, ...prev]);
        }
        resetBannerForm();
      }
    } catch (error) {
      console.error('Failed to save banner:', error);
    } finally {
      setSavingBanner(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch('/api/admin/banners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setBanners(prev => prev.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete banner:', error);
    }
  };

  const handleToggleBanner = async (banner: Banner) => {
    try {
      const response = await fetch('/api/admin/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: banner.id, is_active: !banner.is_active }),
      });

      if (response.ok) {
        const data = await response.json();
        setBanners(prev => prev.map(b => b.id === data.banner.id ? data.banner : b));
      }
    } catch (error) {
      console.error('Failed to toggle banner:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
      create_banner: 'Created Banner',
      update_banner: 'Updated Banner',
      delete_banner: 'Deleted Banner',
      delete_user: 'Deleted User',
      update_suggestion: 'Updated Suggestion',
      delete_suggestion: 'Deleted Suggestion',
    };
    return labels[action] || action;
  };

  const typeColors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-2">Admin Settings</h1>
          <p className="text-primary-600 dark:text-primary-300">
            Manage system banners and view activity logs.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'banners'
                ? 'bg-primary-600 text-white'
                : 'bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-slate-600'
            }`}
          >
            Banners
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'logs'
                ? 'bg-primary-600 text-white'
                : 'bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-slate-600'
            }`}
          >
            Activity Logs
          </button>
        </div>

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            {/* Create Banner Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowBannerForm(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Banner
              </button>
            </div>

            {/* Banner Form Modal */}
            {showBannerForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full p-6">
                  <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-4">
                    {editingBanner ? 'Edit Banner' : 'Create Banner'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                        Message *
                      </label>
                      <textarea
                        value={bannerForm.message}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows={3}
                        placeholder="Enter banner message..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                        Type
                      </label>
                      <select
                        value={bannerForm.type}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, type: e.target.value as Banner['type'] }))}
                        className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="info">Info (Blue)</option>
                        <option value="success">Success (Green)</option>
                        <option value="warning">Warning (Amber)</option>
                        <option value="error">Error (Red)</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                          Link Text (optional)
                        </label>
                        <input
                          type="text"
                          value={bannerForm.link_text}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, link_text: e.target.value }))}
                          className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Learn more"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                          Link URL (optional)
                        </label>
                        <input
                          type="url"
                          value={bannerForm.link_url}
                          onChange={(e) => setBannerForm(prev => ({ ...prev, link_url: e.target.value }))}
                          className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                        End Date (optional)
                      </label>
                      <input
                        type="date"
                        value={bannerForm.ends_at}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, ends_at: e.target.value }))}
                        className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={bannerForm.is_active}
                        onChange={(e) => setBannerForm(prev => ({ ...prev, is_active: e.target.checked }))}
                        className="w-4 h-4 text-primary-600 bg-primary-50 dark:bg-slate-700 border-primary-300 dark:border-slate-600 rounded focus:ring-primary-500"
                      />
                      <label htmlFor="is_active" className="text-sm font-medium text-primary-700 dark:text-primary-300">
                        Active (visible to users)
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={resetBannerForm}
                      className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 bg-primary-100 dark:bg-slate-700 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBanner}
                      disabled={savingBanner || !bannerForm.message.trim()}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      {savingBanner ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Banner'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Banners List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
              <div className="p-6 border-b border-black/5 dark:border-white/10">
                <h2 className="text-xl font-semibold text-primary-900 dark:text-white">System Banners</h2>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  Manage announcements displayed to all users
                </p>
              </div>

              {loadingBanners ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
                </div>
              ) : banners.length === 0 ? (
                <div className="p-8 text-center text-primary-500 dark:text-primary-400">
                  No banners created yet. Click &ldquo;New Banner&rdquo; to create one.
                </div>
              ) : (
                <div className="divide-y divide-primary-100 dark:divide-slate-700">
                  {banners.map((banner) => (
                    <div key={banner.id} className="p-4 hover:bg-primary-50 dark:hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[banner.type]}`}>
                              {banner.type}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              banner.is_active
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {banner.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-primary-900 dark:text-white font-medium">{banner.message}</p>
                          {banner.link_text && (
                            <p className="text-sm text-primary-600 dark:text-primary-400 mt-1">
                              Link: {banner.link_text} ({banner.link_url})
                            </p>
                          )}
                          <p className="text-xs text-primary-500 dark:text-primary-400 mt-2">
                            Created {formatDate(banner.created_at)} by {banner.created_by}
                            {banner.ends_at && ` • Ends ${formatDate(banner.ends_at)}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleBanner(banner)}
                            className={`p-2 rounded-lg transition-colors ${
                              banner.is_active
                                ? 'text-amber-600 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                                : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
                            }`}
                            title={banner.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {banner.is_active ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleEditBanner(banner)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                            title="Edit"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(banner.id)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Activity Logs Tab */}
        {activeTab === 'logs' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
            <div className="p-6 border-b border-black/5 dark:border-white/10">
              <h2 className="text-xl font-semibold text-primary-900 dark:text-white">Activity Logs</h2>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                Track admin actions for auditing and debugging
              </p>
            </div>

            {loadingLogs ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
              </div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center text-primary-500 dark:text-primary-400">
                No activity logs yet.
              </div>
            ) : (
              <>
                <div className="divide-y divide-primary-100 dark:divide-slate-700">
                  {logs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-primary-50 dark:hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                              {getActionLabel(log.action)}
                            </span>
                            {log.target_type && (
                              <span className="text-xs text-primary-500 dark:text-primary-400">
                                on {log.target_type}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-primary-900 dark:text-white mt-1">
                            <span className="font-medium">{log.admin_email}</span>
                            {log.target_id && (
                              <span className="text-primary-500 dark:text-primary-400">
                                {' '}• Target ID: {log.target_id.substring(0, 8)}...
                              </span>
                            )}
                          </p>
                          {log.details && Object.keys(log.details).length > 0 && (
                            <p className="text-xs text-primary-500 dark:text-primary-400 mt-1 font-mono">
                              {JSON.stringify(log.details).substring(0, 100)}
                              {JSON.stringify(log.details).length > 100 && '...'}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-primary-500 dark:text-primary-400 whitespace-nowrap">
                          {formatDate(log.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setLogsPage(p => Math.max(1, p - 1))}
                    disabled={logsPage === 1}
                    className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 bg-primary-50 dark:bg-slate-700 rounded-lg hover:bg-primary-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-primary-600 dark:text-primary-400">
                    Page {logsPage}
                  </span>
                  <button
                    onClick={() => setLogsPage(p => p + 1)}
                    disabled={!hasMoreLogs}
                    className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 bg-primary-50 dark:bg-slate-700 rounded-lg hover:bg-primary-100 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        )}
    </div>
  );
}
