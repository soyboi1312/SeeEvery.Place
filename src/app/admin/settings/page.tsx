'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Pencil, Trash2, Power, PowerOff, Loader2 } from 'lucide-react';

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

interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

const bannerTypeVariants: Record<Banner['type'], 'info' | 'warning' | 'success' | 'destructive'> = {
  info: 'info',
  warning: 'warning',
  success: 'success',
  error: 'destructive',
};

export default function AdminSettingsPage() {
  // Banner state
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
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
  const [deleteBannerDialog, setDeleteBannerDialog] = useState<Banner | null>(null);

  // Logs state
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [logsPage, setLogsPage] = useState(1);
  const [hasMoreLogs, setHasMoreLogs] = useState(false);

  // Admins state
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [currentRole, setCurrentRole] = useState<string>('admin');
  const [addAdminDialog, setAddAdminDialog] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [deleteAdminDialog, setDeleteAdminDialog] = useState<AdminUser | null>(null);

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

  // Fetch admins
  useEffect(() => {
    async function fetchAdmins() {
      setLoadingAdmins(true);
      try {
        const response = await fetch('/api/admin/roles');
        if (response.ok) {
          const data = await response.json();
          setAdmins(data.admins || []);
          setCurrentRole(data.currentRole || 'admin');
        }
      } catch (error) {
        console.error('Failed to fetch admins:', error);
      } finally {
        setLoadingAdmins(false);
      }
    }
    fetchAdmins();
  }, []);

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
    setBannerDialogOpen(false);
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
    setBannerDialogOpen(true);
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

  const handleDeleteBanner = async () => {
    if (!deleteBannerDialog) return;

    try {
      const response = await fetch('/api/admin/banners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteBannerDialog.id }),
      });

      if (response.ok) {
        setBanners(prev => prev.filter(b => b.id !== deleteBannerDialog.id));
        setDeleteBannerDialog(null);
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

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) return;
    setAddingAdmin(true);
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAdminEmail, role: 'admin' }),
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(prev => [...prev, data.admin]);
        setNewAdminEmail('');
        setAddAdminDialog(false);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add admin');
      }
    } catch (error) {
      console.error('Failed to add admin:', error);
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!deleteAdminDialog) return;
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: deleteAdminDialog.id }),
      });
      if (response.ok) {
        setAdmins(prev => prev.filter(a => a.id !== deleteAdminDialog.id));
        setDeleteAdminDialog(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to remove admin');
      }
    } catch (error) {
      console.error('Failed to remove admin:', error);
    }
  };

  const handleToggleRole = async (admin: AdminUser) => {
    const newRole = admin.role === 'super_admin' ? 'admin' : 'super_admin';
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: admin.id, role: newRole }),
      });
      if (response.ok) {
        setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, role: newRole } : a));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update role');
      }
    } catch (error) {
      console.error('Failed to update role:', error);
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage system banners, view activity logs, and admin access.
        </p>
      </div>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="admins">Admin Users</TabsTrigger>
        </TabsList>

        {/* Banners Tab */}
        <TabsContent value="banners">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>System Banners</CardTitle>
                <CardDescription>Manage announcements displayed to all users</CardDescription>
              </div>
              <Button onClick={() => setBannerDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> New Banner
              </Button>
            </CardHeader>
            <CardContent>
              {loadingBanners ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : banners.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No banners created yet. Click &ldquo;New Banner&rdquo; to create one.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Message</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banners.map((banner) => (
                      <TableRow key={banner.id}>
                        <TableCell className="max-w-[300px] truncate">
                          {banner.message}
                        </TableCell>
                        <TableCell>
                          <Badge variant={bannerTypeVariants[banner.type]}>
                            {banner.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={banner.is_active ? 'success' : 'secondary'}>
                            {banner.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(banner.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleBanner(banner)}
                              title={banner.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {banner.is_active ? (
                                <PowerOff className="h-4 w-4 text-amber-600" />
                              ) : (
                                <Power className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditBanner(banner)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteBannerDialog(banner)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>Track admin actions for auditing and debugging</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingLogs ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : logs.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No activity logs yet.
                </p>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Admin</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <Badge variant="secondary">{getActionLabel(log.action)}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{log.admin_email}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {log.target_type && `${log.target_type}`}
                            {log.target_id && ` (${log.target_id.substring(0, 8)}...)`}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(log.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setLogsPage(p => Math.max(1, p - 1))}
                      disabled={logsPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">Page {logsPage}</span>
                    <Button
                      variant="outline"
                      onClick={() => setLogsPage(p => p + 1)}
                      disabled={!hasMoreLogs}
                    >
                      Next
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Users Tab */}
        <TabsContent value="admins">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Admin Users</CardTitle>
                <CardDescription>Manage users who have admin access</CardDescription>
              </div>
              {currentRole === 'super_admin' && (
                <Button onClick={() => setAddAdminDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Admin
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {loadingAdmins ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : admins.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No admin users found.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Added</TableHead>
                      {currentRole === 'super_admin' && (
                        <TableHead className="text-right">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">{admin.email}</TableCell>
                        <TableCell>
                          <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'}>
                            {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(admin.created_at)}
                        </TableCell>
                        {currentRole === 'super_admin' && (
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleRole(admin)}
                              >
                                {admin.role === 'super_admin' ? 'Demote' : 'Promote'}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteAdminDialog(admin)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* Role explanation */}
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Role Permissions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-3">
                    <Badge variant="secondary">Admin</Badge>
                    <span className="text-muted-foreground">
                      View analytics, manage users, update suggestions, and manage banners.
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Badge>Super Admin</Badge>
                    <span className="text-muted-foreground">
                      All Admin permissions plus: add/remove admins, change admin roles, suspend/ban users.
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Banner Dialog */}
      <Dialog open={bannerDialogOpen} onOpenChange={(open) => !open && resetBannerForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBanner ? 'Edit Banner' : 'Create Banner'}</DialogTitle>
            <DialogDescription>
              {editingBanner ? 'Update the banner details below.' : 'Create a new announcement banner.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={bannerForm.message}
                onChange={(e) => setBannerForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Enter banner message..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={bannerForm.type}
                onValueChange={(value) => setBannerForm(prev => ({ ...prev, type: value as Banner['type'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info (Blue)</SelectItem>
                  <SelectItem value="success">Success (Green)</SelectItem>
                  <SelectItem value="warning">Warning (Amber)</SelectItem>
                  <SelectItem value="error">Error (Red)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link_text">Link Text</Label>
                <Input
                  id="link_text"
                  value={bannerForm.link_text}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, link_text: e.target.value }))}
                  placeholder="Learn more"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link_url">Link URL</Label>
                <Input
                  id="link_url"
                  type="url"
                  value={bannerForm.link_url}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, link_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ends_at">End Date (optional)</Label>
              <Input
                id="ends_at"
                type="date"
                value={bannerForm.ends_at}
                onChange={(e) => setBannerForm(prev => ({ ...prev, ends_at: e.target.value }))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={bannerForm.is_active}
                onCheckedChange={(checked) => setBannerForm(prev => ({ ...prev, is_active: checked }))}
              />
              <Label htmlFor="is_active">Active (visible to users)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetBannerForm}>Cancel</Button>
            <Button onClick={handleSaveBanner} disabled={savingBanner || !bannerForm.message.trim()}>
              {savingBanner && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingBanner ? 'Save Changes' : 'Create Banner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Banner Dialog */}
      <AlertDialog open={!!deleteBannerDialog} onOpenChange={(open) => !open && setDeleteBannerDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Banner?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this banner. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBanner} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Admin Dialog */}
      <Dialog open={addAdminDialog} onOpenChange={setAddAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
            <DialogDescription>
              Enter the email address of the user you want to grant admin access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin_email">Email Address</Label>
              <Input
                id="admin_email"
                type="email"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              The user will be granted admin access with basic privileges. You can promote them to super admin later.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddAdminDialog(false); setNewAdminEmail(''); }}>
              Cancel
            </Button>
            <Button onClick={handleAddAdmin} disabled={addingAdmin || !newAdminEmail.trim()}>
              {addingAdmin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Admin Dialog */}
      <AlertDialog open={!!deleteAdminDialog} onOpenChange={(open) => !open && setDeleteAdminDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove admin access for {deleteAdminDialog?.email}. They will no longer be able to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveAdmin} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
