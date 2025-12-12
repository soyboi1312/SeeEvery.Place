'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Lightbulb,
  CheckCircle,
  Settings,
  Mail,
  ChevronRight,
  Search,
  Download,
  Eye,
  UserCog,
  Ban,
  Trash2,
  CheckCircle2,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  X,
  Loader2,
} from 'lucide-react';
import { categoryLabels, Category, Selection } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  categories_count: number;
  total_visited: number;
  total_bucket_list: number;
  status?: 'active' | 'suspended' | 'banned';
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

type SortField = 'email' | 'created_at' | 'last_sign_in_at' | 'total_visited' | 'total_bucket_list' | 'categories_count';
type SortDirection = 'asc' | 'desc';

const quickLinks = [
  {
    title: 'Analytics',
    description: 'View statistics',
    href: '/admin/analytics',
    icon: BarChart3,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    title: 'Suggestions',
    description: 'Review ideas',
    href: '/admin/suggestions',
    icon: Lightbulb,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-100 dark:bg-purple-900/30',
  },
  {
    title: 'Data Health',
    description: 'Validate data',
    href: '/admin/data-health',
    icon: CheckCircle,
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    title: 'Settings',
    description: 'Banners & Logs',
    href: '/admin/settings',
    icon: Settings,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    title: 'Newsletter',
    description: 'Email campaigns',
    href: '/admin/newsletter',
    icon: Mail,
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-100 dark:bg-pink-900/30',
  },
];

export default function AdminDashboard() {
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
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendUntil, setSuspendUntil] = useState('');
  const [suspending, setSuspending] = useState(false);
  const [impersonating, setImpersonating] = useState<string | null>(null);
  const [impersonationLink, setImpersonationLink] = useState<{ link: string; email: string } | null>(null);
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

  const filteredUsers = usersData?.users.filter((user: User) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a: User, b: User) => {
    let aVal: string | number | null;
    let bVal: string | number | null;

    switch (sortField) {
      case 'email':
        aVal = a.email.toLowerCase();
        bVal = b.email.toLowerCase();
        break;
      case 'created_at':
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
        break;
      case 'last_sign_in_at':
        aVal = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : 0;
        bVal = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : 0;
        break;
      case 'total_visited':
        aVal = a.total_visited;
        bVal = b.total_visited;
        break;
      case 'total_bucket_list':
        aVal = a.total_bucket_list;
        bVal = b.total_bucket_list;
        break;
      case 'categories_count':
        aVal = a.categories_count;
        bVal = b.categories_count;
        break;
      default:
        return 0;
    }

    if (aVal === null || bVal === null) return 0;
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }) || [];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev: SortDirection) => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3 h-3 text-primary" />
    ) : (
      <ChevronDown className="w-3 h-3 text-primary" />
    );
  };

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

      setUsersData((prev: UsersData | null) => prev ? {
        ...prev,
        users: prev.users.filter((u: User) => u.id !== userToDelete.id),
        pagination: { ...prev.pagination, count: prev.pagination.count - 1 },
      } : null);

      setUserToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    if (!usersData?.users) return;

    const headers = ['ID', 'Email', 'Joined', 'Last Sign In', 'Categories', 'Visited Count', 'Bucket List Count'];
    const csvContent = [
      headers.join(','),
      ...usersData.users.map(u => [
        u.id,
        `"${u.email}"`,
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

  const handleSuspendUser = async (status: 'suspended' | 'banned') => {
    if (!userToSuspend) return;

    setSuspending(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/users/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userToSuspend.id,
          status,
          reason: suspendReason || undefined,
          until: suspendUntil || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update user status');
      }

      setUsersData(prev => prev ? {
        ...prev,
        users: prev.users.map(u =>
          u.id === userToSuspend.id ? { ...u, status } : u
        ),
      } : null);

      setUserToSuspend(null);
      setSuspendReason('');
      setSuspendUntil('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');
    } finally {
      setSuspending(false);
    }
  };

  const handleActivateUser = async (user: User) => {
    try {
      const response = await fetch('/api/admin/users/status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          status: 'active',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to activate user');
      }

      setUsersData(prev => prev ? {
        ...prev,
        users: prev.users.map(u =>
          u.id === user.id ? { ...u, status: 'active' } : u
        ),
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate user');
    }
  };

  const handleImpersonate = async (user: User) => {
    setImpersonating(user.id);
    setError(null);

    try {
      const response = await fetch('/api/admin/users/impersonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to impersonate user');
      }

      const data = await response.json();
      setImpersonationLink({ link: data.link, email: data.email });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to impersonate user');
    } finally {
      setImpersonating(null);
    }
  };

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users and access admin tools.
        </p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer group h-full">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${link.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <link.icon className={`w-6 h-6 ${link.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                {usersData ? `Page ${usersData.pagination.page} (${usersData.pagination.count} users)` : 'Loading...'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
              <Button
                onClick={handleExportCSV}
                disabled={!usersData?.users?.length}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <div className="p-6">
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
                {error}
              </div>
            </div>
          )}

          {usersData && !loading && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
                        onClick={() => handleSort('email')}
                      >
                        <span className="flex items-center gap-1">
                          Email
                          <SortIndicator field="email" />
                        </span>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
                        onClick={() => handleSort('created_at')}
                      >
                        <span className="flex items-center gap-1">
                          Joined
                          <SortIndicator field="created_at" />
                        </span>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
                        onClick={() => handleSort('last_sign_in_at')}
                      >
                        <span className="flex items-center gap-1">
                          Last Sign In
                          <SortIndicator field="last_sign_in_at" />
                        </span>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
                        onClick={() => handleSort('categories_count')}
                      >
                        <span className="flex items-center gap-1">
                          Categories
                          <SortIndicator field="categories_count" />
                        </span>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
                        onClick={() => handleSort('total_visited')}
                      >
                        <span className="flex items-center gap-1">
                          Visited
                          <SortIndicator field="total_visited" />
                        </span>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50 transition-colors group"
                        onClick={() => handleSort('total_bucket_list')}
                      >
                        <span className="flex items-center gap-1">
                          Bucket List
                          <SortIndicator field="total_bucket_list" />
                        </span>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          {searchTerm ? 'No users found matching your search.' : 'No users yet.'}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow
                          key={user.id}
                          className={user.status === 'suspended' || user.status === 'banned' ? 'opacity-60' : ''}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{user.email}</span>
                              {user.status === 'suspended' && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                  Suspended
                                </Badge>
                              )}
                              {user.status === 'banned' && (
                                <Badge variant="destructive">
                                  Banned
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(user.created_at)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(user.last_sign_in_at)}
                          </TableCell>
                          <TableCell>{user.categories_count}</TableCell>
                          <TableCell>
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              {user.total_visited}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-amber-600 dark:text-amber-400 font-medium">
                              {user.total_bucket_list}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setUserToView(user)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleImpersonate(user)}
                                  disabled={impersonating === user.id}
                                >
                                  <UserCog className="mr-2 h-4 w-4" />
                                  {impersonating === user.id ? 'Impersonating...' : 'Impersonate'}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {user.status === 'suspended' || user.status === 'banned' ? (
                                  <DropdownMenuItem onClick={() => handleActivateUser(user)}>
                                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" />
                                    <span className="text-green-600">Activate</span>
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => setUserToSuspend(user)}>
                                    <Ban className="mr-2 h-4 w-4 text-amber-600" />
                                    <span className="text-amber-600">Suspend/Ban</span>
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => setUserToDelete(user)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="px-6 py-4 border-t flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={!usersData.pagination.hasMore}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{userToDelete?.email}</strong>? This will permanently remove their account and all their data. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete User'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Detail Dialog */}
      <Dialog open={!!userToView} onOpenChange={(open) => !open && setUserToView(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>{userToView?.email}</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4">
            {loadingDetail ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : userDetail ? (
              <div className="space-y-6">
                {/* User Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Joined</p>
                      <p className="text-lg font-semibold">{formatDate(userDetail.created_at)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground">Last Sign In</p>
                      <p className="text-lg font-semibold">{formatDate(userDetail.last_sign_in_at)}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                    <CardContent className="p-4">
                      <p className="text-sm text-green-700 dark:text-green-400">Total Visited</p>
                      <p className="text-lg font-semibold text-green-800 dark:text-green-300">{userDetail.totalVisited}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900">
                    <CardContent className="p-4">
                      <p className="text-sm text-amber-700 dark:text-amber-400">Total Bucket List</p>
                      <p className="text-lg font-semibold text-amber-800 dark:text-amber-300">{userDetail.totalBucketList}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Category Breakdown */}
                {userDetail.categoryStats.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold">Category Breakdown</h4>

                    {/* Category Pills */}
                    <div className="flex flex-wrap gap-2">
                      {userDetail.categoryStats.map((stat) => (
                        <Button
                          key={stat.category}
                          variant={selectedCategory === stat.category ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedCategory(stat.category)}
                        >
                          {categoryLabels[stat.category]}
                          <Badge variant="secondary" className="ml-2">
                            {stat.visited + stat.bucketList}
                          </Badge>
                        </Button>
                      ))}
                    </div>

                    {/* Selected Category Details */}
                    {selectedCategory && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">
                            {categoryLabels[selectedCategory]}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                        <div key={item.id} className="text-sm bg-muted rounded px-2 py-1">
                                          {item.id}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">None</p>
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
                                        <div key={item.id} className="text-sm bg-muted rounded px-2 py-1">
                                          {item.id}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">None</p>
                                  )}
                                </div>
                              </div>
                            );
                          })()}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    This user has not tracked any places yet.
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToView(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend/Ban Dialog */}
      <Dialog open={!!userToSuspend} onOpenChange={(open) => {
        if (!open) {
          setUserToSuspend(null);
          setSuspendReason('');
          setSuspendUntil('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend or Ban User</DialogTitle>
            <DialogDescription>
              Taking action on <strong>{userToSuspend?.email}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="suspend-reason">Reason (optional)</Label>
              <Textarea
                id="suspend-reason"
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Reason for suspension/ban..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="suspend-until">Suspend until (leave empty for indefinite)</Label>
              <Input
                id="suspend-until"
                type="datetime-local"
                value={suspendUntil}
                onChange={(e) => setSuspendUntil(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setUserToSuspend(null);
                setSuspendReason('');
                setSuspendUntil('');
              }}
              disabled={suspending}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleSuspendUser('suspended')}
              disabled={suspending}
              className="bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
            >
              {suspending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Suspend
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleSuspendUser('banned')}
              disabled={suspending}
            >
              {suspending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Impersonation Link Dialog */}
      <Dialog open={!!impersonationLink} onOpenChange={(open) => !open && setImpersonationLink(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Impersonate User</DialogTitle>
            <DialogDescription>
              Login link for <strong>{impersonationLink?.email}</strong>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Click the button below to open a new tab and log in as this user.
              The link is a one-time magic link that will expire shortly.
            </p>
            <div className="flex gap-2">
              <Input
                readOnly
                value={impersonationLink?.link || ''}
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                onClick={() => {
                  if (impersonationLink?.link) {
                    navigator.clipboard.writeText(impersonationLink.link);
                  }
                }}
              >
                Copy
              </Button>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setImpersonationLink(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (impersonationLink?.link) {
                  window.open(impersonationLink.link, '_blank');
                  setImpersonationLink(null);
                }
              }}
            >
              Open Login Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
