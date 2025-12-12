'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import RichTextEditor from './RichTextEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2, Send, Loader2, Search, Users, Mail, FileText, Clock } from 'lucide-react';

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

  // Delete confirmations
  const [deleteNewsletterId, setDeleteNewsletterId] = useState<string | null>(null);
  const [deleteSubscriberId, setDeleteSubscriberId] = useState<string | null>(null);

  // Send confirmation
  const [showSendConfirm, setShowSendConfirm] = useState(false);

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

    setSending(true);
    setShowSendConfirm(false);
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

  const handleDeleteNewsletter = async () => {
    if (!deleteNewsletterId) return;

    try {
      const response = await fetch('/api/admin/newsletter', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteNewsletterId }),
      });

      if (response.ok) {
        setNewsletters(prev => prev.filter(n => n.id !== deleteNewsletterId));
      } else {
        const error = await response.json();
        alert(`Failed to delete: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting newsletter:', error);
    } finally {
      setDeleteNewsletterId(null);
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

  const handleDeleteSubscriber = async () => {
    if (!deleteSubscriberId) return;

    try {
      const response = await fetch('/api/admin/newsletter/subscribers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteSubscriberId }),
      });

      if (response.ok) {
        setSubscribers(prev => prev.filter(s => s.id !== deleteSubscriberId));
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
    } finally {
      setDeleteSubscriberId(null);
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

  const statusVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    draft: 'secondary',
    scheduled: 'outline',
    sending: 'default',
    sent: 'default',
    failed: 'destructive',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Subscribers</span>
            </div>
            <p className="text-2xl font-bold">{subscriberStats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{subscriberStats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Newsletters Sent</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{newsletterStats.sent}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-muted-foreground">Drafts</span>
            </div>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{newsletterStats.draft}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="mb-6">
        <TabsList>
          <TabsTrigger value="newsletters">Newsletters</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="compose">Compose</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Newsletters Tab */}
      {activeTab === 'newsletters' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleNewNewsletter}>
              <Plus className="w-4 h-4 mr-2" />
              New Newsletter
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {loadingNewsletters ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : newsletters.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No newsletters yet. Create your first one!
                </div>
              ) : (
                <div className="divide-y">
                  {newsletters.map((newsletter) => (
                    <div key={newsletter.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={statusVariants[newsletter.status]}>
                              {newsletter.status}
                            </Badge>
                            {newsletter.sent_at && (
                              <span className="text-xs text-muted-foreground">
                                Sent to {newsletter.recipient_count} subscribers
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold">{newsletter.subject}</h3>
                          {newsletter.preview_text && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {newsletter.preview_text}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Created {formatDate(newsletter.created_at)} by {newsletter.created_by}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {newsletter.status === 'draft' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditNewsletter(newsletter)}
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                          )}
                          {newsletter.status !== 'sending' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteNewsletterId(newsletter.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search subscribers..."
                value={subscriberSearch}
                onChange={(e) => setSubscriberSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => setShowAddSubscriber(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Subscriber
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {loadingSubscribers ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : subscribers.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No subscribers yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell className="font-medium">{subscriber.email}</TableCell>
                          <TableCell className="text-muted-foreground">{subscriber.name || '-'}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                subscriber.is_active && subscriber.confirmed_at
                                  ? 'default'
                                  : subscriber.is_active && !subscriber.confirmed_at
                                  ? 'secondary'
                                  : 'outline'
                              }
                              className={
                                subscriber.is_active && subscriber.confirmed_at
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100'
                                  : subscriber.is_active && !subscriber.confirmed_at
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-100'
                                  : ''
                              }
                            >
                              {subscriber.is_active && subscriber.confirmed_at
                                ? 'Active'
                                : subscriber.is_active && !subscriber.confirmed_at
                                ? 'Pending'
                                : 'Unsubscribed'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{subscriber.source}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(subscriber.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteSubscriberId(subscriber.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compose Tab */}
      {activeTab === 'compose' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingNewsletter ? 'Edit Newsletter' : 'Compose Newsletter'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Your newsletter subject..."
                />
              </div>

              <div>
                <Label htmlFor="preview">Preview Text (shown in email clients)</Label>
                <Input
                  id="preview"
                  value={composeForm.preview_text}
                  onChange={(e) => setComposeForm(prev => ({ ...prev, preview_text: e.target.value }))}
                  placeholder="Brief preview text..."
                />
              </div>

              <div>
                <Label>Content *</Label>
                <RichTextEditor
                  value={composeForm.content_html}
                  onChange={(html) => setComposeForm(prev => ({ ...prev, content_html: html }))}
                  placeholder="Start writing your newsletter content..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use the toolbar to format your content. The content will be wrapped in our email template.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleSaveNewsletter('draft')}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save as Draft'
                  )}
                </Button>

                {editingNewsletter && (
                  <>
                    <div className="flex items-center gap-2">
                      <Input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="Test email"
                        className="w-40"
                      />
                      <Button
                        variant="secondary"
                        onClick={handleSendTest}
                        disabled={sendingTest}
                      >
                        {sendingTest ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          'Send Test'
                        )}
                      </Button>
                    </div>

                    <Button
                      onClick={() => setShowSendConfirm(true)}
                      disabled={sending || editingNewsletter.status === 'sent'}
                      className="ml-auto bg-green-600 hover:bg-green-700"
                    >
                      {sending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send to {subscriberStats.active} subscribers
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Suggestions</CardTitle>
              <CardDescription>
                Use the analytics data to create engaging content. Visit the{' '}
                <Link href="/admin/analytics" className="text-primary underline hover:text-primary/80">
                  Analytics Dashboard
                </Link>{' '}
                to find:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <strong className="text-foreground">Top 10 Places:</strong> Most popular destinations to highlight
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <strong className="text-foreground">Hidden Gems:</strong> Least visited places to challenge your readers
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  <strong className="text-foreground">Unvisited Bucket List:</strong> Places people want to visit but haven&apos;t yet
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Subscriber Dialog */}
      <Dialog open={showAddSubscriber} onOpenChange={setShowAddSubscriber}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subscriber</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subscriber-email">Email *</Label>
              <Input
                id="subscriber-email"
                type="email"
                value={newSubscriber.email}
                onChange={(e) => setNewSubscriber(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="subscriber-name">Name (optional)</Label>
              <Input
                id="subscriber-name"
                value={newSubscriber.name}
                onChange={(e) => setNewSubscriber(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setShowAddSubscriber(false); setNewSubscriber({ email: '', name: '' }); }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddSubscriber} disabled={addingSubscriber}>
              {addingSubscriber ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Subscriber'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Newsletter Confirmation */}
      <AlertDialog open={!!deleteNewsletterId} onOpenChange={(open) => !open && setDeleteNewsletterId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Newsletter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this newsletter? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNewsletter} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Subscriber Confirmation */}
      <AlertDialog open={!!deleteSubscriberId} onOpenChange={(open) => !open && setDeleteSubscriberId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscriber</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this subscriber? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSubscriber} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Newsletter Confirmation */}
      <AlertDialog open={showSendConfirm} onOpenChange={setShowSendConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Newsletter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to send this newsletter to {subscriberStats.active} active subscribers? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSendNewsletter} className="bg-green-600 hover:bg-green-700">
              Send Newsletter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
