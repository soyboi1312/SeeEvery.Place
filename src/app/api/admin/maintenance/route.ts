import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * Admin Maintenance API
 * Handles database maintenance tasks like activity feed cleanup.
 *
 * POST /api/admin/maintenance
 * Body: { action: 'cleanup-activity-feed', retentionDays?: number }
 *
 * Security:
 * - Requires admin authentication (checked via admin_emails table)
 * - Can also be called with CRON_SECRET for automated scheduling
 */

interface MaintenanceResult {
  action: string;
  success: boolean;
  deletedCount?: number;
  error?: string;
  timestamp: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<MaintenanceResult>> {
  try {
    // Check for cron secret (for automated scheduling) or admin auth
    const cronSecret = request.headers.get('x-cron-secret');
    const isAuthorizedCron = cronSecret && cronSecret === process.env.CRON_SECRET;

    if (!isAuthorizedCron) {
      // Fall back to admin authentication check
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json(
          { action: 'auth', success: false, error: 'Not authenticated', timestamp: new Date().toISOString() },
          { status: 401 }
        );
      }

      // Check if user is admin
      const { data: adminData } = await supabase
        .from('admin_emails')
        .select('email')
        .eq('email', user.email?.toLowerCase())
        .single();

      if (!adminData) {
        return NextResponse.json(
          { action: 'auth', success: false, error: 'Not authorized', timestamp: new Date().toISOString() },
          { status: 403 }
        );
      }
    }

    // Parse request body
    const body = await request.json();
    const { action, retentionDays = 90 } = body;

    if (action === 'cleanup-activity-feed') {
      // Use admin client to call the cleanup function
      const adminClient = createAdminClient();

      const { data, error } = await adminClient.rpc('cleanup_old_activity_feed', {
        retention_days: retentionDays,
      });

      if (error) {
        console.error('Activity feed cleanup error:', error);
        return NextResponse.json(
          {
            action: 'cleanup-activity-feed',
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        action: 'cleanup-activity-feed',
        success: true,
        deletedCount: data || 0,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      {
        action: action || 'unknown',
        success: false,
        error: 'Unknown maintenance action',
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Maintenance API error:', error);
    return NextResponse.json(
      {
        action: 'error',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
