import AdminDashboard from './AdminDashboard';

// This page is protected by middleware - only admin users can access it
export default function AdminPage() {
  return <AdminDashboard />;
}
