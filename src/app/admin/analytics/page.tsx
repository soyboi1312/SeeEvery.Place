import AnalyticsDashboard from './AnalyticsDashboard';

// This page is protected by middleware - only admin users can access it
export default function AdminAnalyticsPage() {
  return <AnalyticsDashboard />;
}
