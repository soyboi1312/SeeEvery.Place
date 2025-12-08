import { createClient } from '@/lib/supabase/server';
import AdminSuggestionsClient, { Suggestion } from './AdminSuggestionsClient';

// Force dynamic rendering since this page fetches from Supabase
export const dynamic = 'force-dynamic';

// This page is protected by middleware - only admin users can access it
export default async function AdminSuggestionsPage() {
  const supabase = await createClient();

  // Fetch suggestions server-side for faster initial load
  // Limit to 500 to prevent performance issues at scale
  const { data: suggestions, error } = await supabase
    .from('suggestions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('Error fetching suggestions:', error);
  }

  return (
    <AdminSuggestionsClient
      initialSuggestions={(suggestions as Suggestion[]) || []}
    />
  );
}
