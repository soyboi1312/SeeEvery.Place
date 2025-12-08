-- Migration: Create analytics RPC function
-- This moves analytics aggregation to the database layer for better scalability
-- Instead of fetching all user data into memory, the aggregation happens in Postgres

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_analytics_summary();

-- Create the analytics aggregation function
CREATE OR REPLACE FUNCTION get_analytics_summary()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
  categories TEXT[] := ARRAY[
    'countries', 'states', 'nationalParks', 'nationalMonuments', 'stateParks',
    'fiveKPeaks', 'fourteeners', 'museums', 'mlbStadiums', 'nflStadiums',
    'nbaStadiums', 'nhlStadiums', 'soccerStadiums', 'f1Tracks', 'marathons',
    'airports', 'skiResorts', 'themeParks', 'surfingReserves', 'weirdAmericana'
  ];
BEGIN
  -- Security check: only admins can access analytics
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied: admin privileges required';
  END IF;

  WITH
  -- Expand each user's selections into rows per category/item
  expanded AS (
    SELECT
      us.user_id,
      cat.category,
      item->>'id' AS item_id,
      item->>'status' AS status,
      COALESCE((item->>'deleted')::boolean, false) AS is_deleted
    FROM user_selections us
    CROSS JOIN UNNEST(categories) AS cat(category)
    CROSS JOIN LATERAL jsonb_array_elements(
      COALESCE(us.selections->cat.category, '[]'::jsonb)
    ) AS item
    WHERE COALESCE((item->>'deleted')::boolean, false) = false
  ),

  -- Calculate per-user stats for each category
  user_category_stats AS (
    SELECT
      user_id,
      category,
      COUNT(*) FILTER (WHERE status = 'visited') AS visited_count,
      COUNT(*) FILTER (WHERE status = 'bucketList') AS bucket_list_count,
      COUNT(*) AS total_items
    FROM expanded
    GROUP BY user_id, category
  ),

  -- Aggregate category stats
  category_stats AS (
    SELECT
      category,
      COUNT(DISTINCT user_id) AS users_tracking,
      ROUND(AVG(visited_count)::numeric, 2) AS avg_visited,
      ROUND(AVG(bucket_list_count)::numeric, 2) AS avg_bucket_list,
      MAX(visited_count) AS max_visited,
      SUM(visited_count) AS total_visited
    FROM user_category_stats
    WHERE visited_count > 0 OR bucket_list_count > 0
    GROUP BY category
    ORDER BY users_tracking DESC
  ),

  -- Get ALL state stats (no LIMIT - needed for heatmap visualization)
  popular_states AS (
    SELECT
      item_id AS id,
      COUNT(*) FILTER (WHERE status = 'visited') AS times_visited,
      COUNT(*) FILTER (WHERE status = 'bucketList') AS times_bucket_listed
    FROM expanded
    WHERE category = 'states'
    GROUP BY item_id
    ORDER BY times_visited DESC
  ),

  -- Get ALL country stats (no LIMIT - needed for heatmap visualization)
  popular_countries AS (
    SELECT
      item_id AS id,
      COUNT(*) FILTER (WHERE status = 'visited') AS times_visited,
      COUNT(*) FILTER (WHERE status = 'bucketList') AS times_bucket_listed
    FROM expanded
    WHERE category = 'countries'
    GROUP BY item_id
    ORDER BY times_visited DESC
  ),

  -- Overview stats
  overview AS (
    SELECT
      (SELECT COUNT(*) FROM user_selections) AS total_users,
      (SELECT COUNT(DISTINCT user_id) FROM user_category_stats WHERE total_items > 0) AS users_with_selections,
      (SELECT COUNT(DISTINCT user_id) FROM user_category_stats WHERE category = 'states' AND visited_count > 0) AS users_tracking_states,
      (SELECT COUNT(DISTINCT user_id) FROM user_category_stats WHERE category = 'countries' AND visited_count > 0) AS users_tracking_countries
  )

  -- Build the final JSON result
  SELECT json_build_object(
    'overview', (SELECT row_to_json(overview) FROM overview),
    'categoryStats', COALESCE((
      SELECT json_agg(json_build_object(
        'category', category,
        'usersTracking', users_tracking,
        'avgVisited', avg_visited,
        'avgBucketList', avg_bucket_list,
        'maxVisited', max_visited,
        'totalVisited', total_visited
      ))
      FROM category_stats
    ), '[]'::json),
    'popularStates', COALESCE((
      SELECT json_agg(json_build_object(
        'id', id,
        'timesVisited', times_visited,
        'timesBucketListed', times_bucket_listed
      ))
      FROM popular_states
    ), '[]'::json),
    'popularCountries', COALESCE((
      SELECT json_agg(json_build_object(
        'id', id,
        'timesVisited', times_visited,
        'timesBucketListed', times_bucket_listed
      ))
      FROM popular_countries
    ), '[]'::json)
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users (admin check happens in the API)
GRANT EXECUTE ON FUNCTION get_analytics_summary() TO authenticated;

-- Add a comment describing the function
COMMENT ON FUNCTION get_analytics_summary() IS
'Aggregates analytics data for all users. Returns category stats, popular items, and overview metrics.
Should only be called by admin users (verified in API layer).';
