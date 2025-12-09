'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDarkMode } from '@/lib/hooks/useDarkMode';

interface Newsletter {
  id: string;
  subject: string;
  preview_text: string | null;
  content_html: string;
  content_text: string | null;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  scheduled_at: string | null;
  sent_at: string | null;
  sent_by: string | null;
  recipient_count: number;
  content_type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  confirmed_at: string | null;
  source: string;
  created_at: string;
}

interface SubscriberStats {
  total: number;
  active: number;
  confirmed: number;
  unsubscribed: number;
}

interface NewsletterStats {
  total: number;
  draft: number;
  scheduled: number;
  sent: number;
}

type Tab = 'newsletters' | 'subscribers' | 'compose';

export default function NewsletterAdminPage() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<Tab>('newsletters');

  // Newsletter state
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [newsletterStats, setNewsletterStats] = useState<NewsletterStats>({ total: 0, draft: 0, scheduled: 0, sent: 0 });
  const [loadingNewsletters, setLoadingNewsletters] = useState(true);

  // Subscriber state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriberStats, setSubscriberStats] = useState<SubscriberStats>({ total: 0, active: 0, confirmed: 0, unsubscribed: 0 });
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);
  const [subscriberSearch, setSubscriberSearch] = useState('');

  // Compose state
  const [editingNewsletter, setEditingNewsletter] = useState<Newsletter | null>(null);
  const [composeForm, setComposeForm] = useState({
    subject: '',
    preview_text: '',
    content_html: '',
  });
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);

  // Add subscriber modal
  const [showAddSubscriber, setShowAddSubscriber] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({ email: '', name: '' });
  const [addingSubscriber, setAddingSubscriber] = useState(false);

  // Fetch newsletters
  useEffect(() => {
    async function fetchNewsletters() {
      setLoadingNewsletters(true);
      try {
        const response = await fetch('/api/admin/newsletter');
        if (response.ok) {
          const data = await response.json();
          setNewsletters(data.newsletters || []);
          setNewsletterStats(data.stats || { total: 0, draft: 0, scheduled: 0, sent: 0 });
        }
      } catch (error) {
        console.error('Failed to fetch newsletters:', error);
      } finally {
        setLoadingNewsletters(false);
      }
    }
    fetchNewsletters();
  }, []);

  // Fetch subscribers
  useEffect(() => {
    async function fetchSubscribers() {
      setLoadingSubscribers(true);
      try {
        const params = new URLSearchParams();
        if (subscriberSearch) params.set('search', subscriberSearch);

        const response = await fetch(`/api/admin/newsletter/subscribers?${params}`);
        if (response.ok) {
          const data = await response.json();
          setSubscribers(data.subscribers || []);
          setSubscriberStats(data.stats || { total: 0, active: 0, confirmed: 0, unsubscribed: 0 });
        }
      } catch (error) {
        console.error('Failed to fetch subscribers:', error);
      } finally {
        setLoadingSubscribers(false);
      }
    }
    fetchSubscribers();
  }, [subscriberSearch]);

  const handleEditNewsletter = (newsletter: Newsletter) => {
    setEditingNewsletter(newsletter);
    setComposeForm({
      subject: newsletter.subject,
      preview_text: newsletter.preview_text || '',
      content_html: newsletter.content_html,
    });
    setActiveTab('compose');
  };

  const handleNewNewsletter = () => {
    setEditingNewsletter(null);
    setComposeForm({ subject: '', preview_text: '', content_html: '' });
    setActiveTab('compose');
  };

  const handleSaveNewsletter = async (status: 'draft' | 'scheduled' = 'draft') => {
    if (!composeForm.subject.trim() || !composeForm.content_html.trim()) {
      alert('Subject and content are required');
      return;
    }

    setSaving(true);
    try {
      const method = editingNewsletter ? 'PUT' : 'POST';
      const payload = {
        ...(editingNewsletter && { id: editingNewsletter.id }),
        subject: composeForm.subject,
        preview_text: composeForm.preview_text || null,
        content_html: composeForm.content_html,
        status,
      };

      const response = await fetch('/api/admin/newsletter', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (editingNewsletter) {
          setNewsletters(prev => prev.map(n => n.id === data.newsletter.id ? data.newsletter : n));
        } else {
          setNewsletters(prev => [data.newsletter, ...prev]);
        }
        setEditingNewsletter(data.newsletter);
        alert('Newsletter saved successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to save: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving newsletter:', error);
      alert('Failed to save newsletter');
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail.trim()) {
      alert('Please enter a test email address');
      return;
    }
    if (!editingNewsletter) {
      alert('Please save the newsletter first');
      return;
    }

    setSendingTest(true);
    try {
      const response = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsletter_id: editingNewsletter.id,
          test_email: testEmail,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Test email sent to ${testEmail}`);
      } else {
        alert(`Failed to send test: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending test:', error);
      alert('Failed to send test email');
    } finally {
      setSendingTest(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!editingNewsletter) {
      alert('Please save the newsletter first');
      return;
    }

    if (!confirm(`Are you sure you want to send this newsletter to ${subscriberStats.active} active subscribers?`)) {
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsletter_id: editingNewsletter.id }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Newsletter sent successfully! ${data.stats.success} of ${data.stats.total} emails delivered.`);
        // Refresh newsletters list
        const refreshResponse = await fetch('/api/admin/newsletter');
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setNewsletters(refreshData.newsletters || []);
          setNewsletterStats(refreshData.stats);
        }
        setActiveTab('newsletters');
      } else {
        alert(`Failed to send: ${data.error}`);
      }
    } catch (error) {
      console.error('Error sending newsletter:', error);
      alert('Failed to send newsletter');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNewsletter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this newsletter?')) return;

    try {
      const response = await fetch('/api/admin/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setNewsletters(prev => prev.filter(n => n.id !== id));
      } else {
        const error = await response.json();
        alert(`Failed to delete: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting newsletter:', error);
    }
  };

  const handleAddSubscriber = async () => {
    if (!newSubscriber.email.trim()) {
      alert('Email is required');
      return;
    }

    setAddingSubscriber(true);
    try {
      const response = await fetch('/api/admin/newsletter/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubscriber),
      });

      if (response.ok) {
        const data = await response.json();
        setSubscribers(prev => [data.subscriber, ...prev]);
        setSubscriberStats(prev => ({
          ...prev,
          total: prev.total + 1,
          active: prev.active + 1,
          confirmed: prev.confirmed + 1,
        }));
        setNewSubscriber({ email: '', name: '' });
        setShowAddSubscriber(false);
        alert(data.reactivated ? 'Subscriber reactivated!' : 'Subscriber added!');
      } else {
        const error = await response.json();
        alert(`Failed to add: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding subscriber:', error);
    } finally {
      setAddingSubscriber(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;

    try {
      const response = await fetch('/api/admin/newsletter/subscribers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setSubscribers(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
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

  const statusColors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    sending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    sent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
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
                Newsletter Manager
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="px-3 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 bg-primary-100 dark:bg-slate-700 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-600 transition-colors"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
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

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/10">
            <p className="text-sm text-primary-600 dark:text-primary-300">Total Subscribers</p>
            <p className="text-2xl font-bold text-primary-900 dark:text-white">{subscriberStats.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/10">
            <p className="text-sm text-primary-600 dark:text-primary-300">Active</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{subscriberStats.active}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/10">
            <p className="text-sm text-primary-600 dark:text-primary-300">Newsletters Sent</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{newsletterStats.sent}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-black/5 dark:border-white/10">
            <p className="text-sm text-primary-600 dark:text-primary-300">Drafts</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{newsletterStats.draft}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('newsletters')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'newsletters'
                ? 'bg-primary-600 text-white'
                : 'bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-slate-600'
            }`}
          >
            Newsletters
          </button>
          <button
            onClick={() => setActiveTab('subscribers')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'subscribers'
                ? 'bg-primary-600 text-white'
                : 'bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-slate-600'
            }`}
          >
            Subscribers
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'compose'
                ? 'bg-primary-600 text-white'
                : 'bg-primary-100 dark:bg-slate-700 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-slate-600'
            }`}
          >
            Compose
          </button>
        </div>

        {/* Newsletters Tab */}
        {activeTab === 'newsletters' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={handleNewNewsletter}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Newsletter
              </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
              {loadingNewsletters ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : newsletters.length === 0 ? (
                <div className="p-8 text-center text-primary-500 dark:text-primary-400">
                  No newsletters yet. Create your first one!
                </div>
              ) : (
                <div className="divide-y divide-primary-100 dark:divide-slate-700">
                  {newsletters.map((newsletter) => (
                    <div key={newsletter.id} className="p-4 hover:bg-primary-50 dark:hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[newsletter.status]}`}>
                              {newsletter.status}
                            </span>
                            {newsletter.sent_at && (
                              <span className="text-xs text-primary-500 dark:text-primary-400">
                                Sent to {newsletter.recipient_count} subscribers
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-primary-900 dark:text-white">{newsletter.subject}</h3>
                          {newsletter.preview_text && (
                            <p className="text-sm text-primary-600 dark:text-primary-400 mt-1 line-clamp-1">
                              {newsletter.preview_text}
                            </p>
                          )}
                          <p className="text-xs text-primary-500 dark:text-primary-400 mt-2">
                            Created {formatDate(newsletter.created_at)} by {newsletter.created_by}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {newsletter.status === 'draft' && (
                            <button
                              onClick={() => handleEditNewsletter(newsletter)}
                              className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                              title="Edit"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          )}
                          {newsletter.status !== 'sending' && (
                            <button
                              onClick={() => handleDeleteNewsletter(newsletter.id)}
                              className="p-2 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                              title="Delete"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Subscribers Tab */}
        {activeTab === 'subscribers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <input
                type="text"
                placeholder="Search subscribers..."
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white placeholder-primary-400 dark:placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={() => setShowAddSubscriber(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Subscriber
              </button>
            </div>

            {/* Add Subscriber Modal */}
            {showAddSubscriber && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
                  <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-4">Add Subscriber</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={newSubscriber.email}
                        onChange={(e) => setNewSubscriber(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                        Name (optional)
                      </label>
                      <input
                        type="text"
                        value={newSubscriber.name}
                        onChange={(e) => setNewSubscriber(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => { setShowAddSubscriber(false); setNewSubscriber({ email: '', name: '' }); }}
                      className="px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-200 bg-primary-100 dark:bg-slate-700 rounded-lg hover:bg-primary-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddSubscriber}
                      disabled={addingSubscriber}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                    >
                      {addingSubscriber ? 'Adding...' : 'Add Subscriber'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden">
              {loadingSubscribers ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                </div>
              ) : subscribers.length === 0 ? (
                <div className="p-8 text-center text-primary-500 dark:text-primary-400">
                  No subscribers yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Source</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Joined</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-100 dark:divide-slate-700">
                      {subscribers.map((subscriber) => (
                        <tr key={subscriber.id} className="hover:bg-primary-50 dark:hover:bg-slate-700/30">
                          <td className="px-4 py-3 text-sm text-primary-900 dark:text-white">{subscriber.email}</td>
                          <td className="px-4 py-3 text-sm text-primary-600 dark:text-primary-400">{subscriber.name || '-'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              subscriber.is_active && subscriber.confirmed_at
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                : subscriber.is_active && !subscriber.confirmed_at
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                              {subscriber.is_active && subscriber.confirmed_at
                                ? 'Active'
                                : subscriber.is_active && !subscriber.confirmed_at
                                ? 'Pending'
                                : 'Unsubscribed'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-primary-600 dark:text-primary-400">{subscriber.source}</td>
                          <td className="px-4 py-3 text-sm text-primary-500 dark:text-primary-400">
                            {new Date(subscriber.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDeleteSubscriber(subscriber.id)}
                              className="p-1 rounded text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Compose Tab */}
        {activeTab === 'compose' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 p-6">
              <h2 className="text-xl font-bold text-primary-900 dark:text-white mb-6">
                {editingNewsletter ? 'Edit Newsletter' : 'Compose Newsletter'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={composeForm.subject}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-4 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Your newsletter subject..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                    Preview Text (shown in email clients)
                  </label>
                  <input
                    type="text"
                    value={composeForm.preview_text}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, preview_text: e.target.value }))}
                    className="w-full px-4 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Brief preview text..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 dark:text-primary-300 mb-1">
                    Content (HTML) *
                  </label>
                  <textarea
                    value={composeForm.content_html}
                    onChange={(e) => setComposeForm(prev => ({ ...prev, content_html: e.target.value }))}
                    className="w-full px-4 py-3 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-primary-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={15}
                    placeholder="<h2>Hello!</h2><p>Your newsletter content here...</p>"
                  />
                  <p className="text-xs text-primary-500 dark:text-primary-400 mt-1">
                    Use HTML tags for formatting. The content will be wrapped in our email template.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-primary-100 dark:border-slate-700">
                  <button
                    onClick={() => handleSaveNewsletter('draft')}
                    disabled={saving}
                    className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Saving...' : 'Save as Draft'}
                  </button>

                  {editingNewsletter && (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="email"
                          value={testEmail}
                          onChange={(e) => setTestEmail(e.target.value)}
                          placeholder="Test email"
                          className="px-3 py-2 bg-primary-50 dark:bg-slate-700 border border-primary-200 dark:border-slate-600 rounded-lg text-sm text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <button
                          onClick={handleSendTest}
                          disabled={sendingTest}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 disabled:opacity-50 transition-colors"
                        >
                          {sendingTest ? 'Sending...' : 'Send Test'}
                        </button>
                      </div>

                      <button
                        onClick={handleSendNewsletter}
                        disabled={sending || editingNewsletter.status === 'sent'}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2 ml-auto"
                      >
                        {sending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            Send to {subscriberStats.active} subscribers
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Content Suggestions */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-black/5 dark:border-white/10 p-6">
              <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-4">Content Suggestions</h3>
              <p className="text-sm text-primary-600 dark:text-primary-400 mb-4">
                Use the analytics data to create engaging content. Visit the{' '}
                <Link href="/admin/analytics" className="text-primary-600 dark:text-primary-400 underline hover:text-primary-700">
                  Analytics Dashboard
                </Link>{' '}
                to find:
              </p>
              <ul className="space-y-2 text-sm text-primary-600 dark:text-primary-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <strong>Top 10 Places:</strong> Most popular destinations to highlight
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <strong>Hidden Gems:</strong> Least visited places to challenge your readers
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  <strong>Unvisited Bucket List:</strong> Places people want to visit but haven&apos;t yet
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
