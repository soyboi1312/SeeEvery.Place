'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import { Plus, Trash2, Loader2, Shield, ShieldCheck } from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export default function AdminRolesPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState<string>('admin');
  const [addAdminDialog, setAddAdminDialog] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<string>('admin');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [deleteAdminDialog, setDeleteAdminDialog] = useState<AdminUser | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState(false);
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/roles');
      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
        setCurrentRole(data.currentRole || 'admin');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to fetch admins');
      }
    } catch (err) {
      console.error('Failed to fetch admins:', err);
      setError('Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) return;
    setAddingAdmin(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newAdminEmail, role: newAdminRole }),
      });
      if (response.ok) {
        const data = await response.json();
        setAdmins(prev => [...prev, data.admin]);
        setNewAdminEmail('');
        setNewAdminRole('admin');
        setAddAdminDialog(false);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to add admin');
      }
    } catch (err) {
      console.error('Failed to add admin:', err);
      setError('Failed to add admin');
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!deleteAdminDialog) return;
    setDeletingAdmin(true);
    setError(null);
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
        setError(data.error || 'Failed to remove admin');
      }
    } catch (err) {
      console.error('Failed to remove admin:', err);
      setError('Failed to remove admin');
    } finally {
      setDeletingAdmin(false);
    }
  };

  const handleUpdateRole = async (admin: AdminUser, newRole: string) => {
    if (newRole === admin.role) return;
    setUpdatingRoleId(admin.id);
    setError(null);
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
        setError(data.error || 'Failed to update role');
      }
    } catch (err) {
      console.error('Failed to update role:', err);
      setError('Failed to update role');
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isSuperAdmin = currentRole === 'super_admin';

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Roles</h1>
        <p className="text-muted-foreground">
          Manage users who have administrative access to the platform.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Admin Users</CardTitle>
            <CardDescription>
              {admins.length} admin{admins.length !== 1 ? 's' : ''} with access
            </CardDescription>
          </div>
          {isSuperAdmin && (
            <Button onClick={() => setAddAdminDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Admin
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
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
                  {isSuperAdmin && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {admin.role === 'super_admin' ? (
                          <ShieldCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Shield className="h-4 w-4 text-muted-foreground" />
                        )}
                        {admin.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isSuperAdmin ? (
                        <Select
                          value={admin.role}
                          onValueChange={(value) => handleUpdateRole(admin, value)}
                          disabled={updatingRoleId === admin.id}
                        >
                          <SelectTrigger className="w-[140px]">
                            {updatingRoleId === admin.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={admin.role === 'super_admin' ? 'default' : 'secondary'}>
                          {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(admin.created_at)}
                    </TableCell>
                    {isSuperAdmin && (
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteAdminDialog(admin)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
              <div className="flex gap-3 items-start">
                <Badge variant="secondary" className="mt-0.5">Admin</Badge>
                <span className="text-muted-foreground">
                  View analytics, manage users, update suggestions, and manage banners.
                </span>
              </div>
              <div className="flex gap-3 items-start">
                <Badge className="mt-0.5">Super Admin</Badge>
                <span className="text-muted-foreground">
                  All Admin permissions plus: add/remove admins, change admin roles, suspend/ban users.
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
            <div className="space-y-2">
              <Label htmlFor="admin_role">Role</Label>
              <Select value={newAdminRole} onValueChange={setNewAdminRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              The user will be granted admin access immediately. Ensure the email address matches their login email exactly.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setAddAdminDialog(false); setNewAdminEmail(''); setNewAdminRole('admin'); }}>
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
            <AlertDialogTitle>Remove Admin Access?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove admin access for <strong>{deleteAdminDialog?.email}</strong>. They will no longer be able to access the admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingAdmin}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAdmin}
              disabled={deletingAdmin}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingAdmin && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Remove Admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
