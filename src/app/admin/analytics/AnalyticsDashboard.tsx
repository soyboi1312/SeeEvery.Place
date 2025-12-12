'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tooltip } from 'react-tooltip';
import { Download, X, MapPin, ExternalLink, Copy, Loader2 } from 'lucide-react';
import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { categoryLabels, ALL_CATEGORIES, Category } from '@/lib/types';
import { AnalyticsUSMap, AnalyticsWorldMap, HeatmapLegend } from './AnalyticsMaps';
import { lookupPlace, PlaceDetails } from './placeLookup';
import TimeSeriesChart from './TimeSeriesChart';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TimeSeriesPoint {
  date: string;
  newUsers: number;
  itemsTracked: number;
}

interface TimeSeriesData {
  timeseries: TimeSeriesPoint[];
  totals: { newUsers: number; itemsTracked: number };
  days: number;
}

// CSV Export utility function
function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (!data || data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

interface CategoryStat {
  category: string;
  usersTracking: number;
  avgVisited: number;
  avgBucketList: number;
  maxVisited: number;
  totalVisited: number;
}

interface PopularItem {
  id: string;
  timesVisited: number;
  timesBucketListed: number;
}

interface AnalyticsData {
  overview: {
    totalUsers: number;
    usersWithSelections: number;
    usersTrackingStates: number;
    usersTrackingCountries: number;
  };
  categoryStats: CategoryStat[];
  popularStates: PopularItem[];
  popularCountries: PopularItem[];
  popularItems: Record<string, PopularItem[]>;
  timeframe: string;
  timeframeLabel: string;
}

type ViewMode = 'top' | 'bottom' | 'zero';
type Timeframe = 'allTime' | 'last7Days' | 'last30Days' | 'previousMonth';

const stateNames: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
  'DC': 'Washington D.C.'
};

export default function AnalyticsDashboard() {
  const { isDarkMode } = useDarkMode();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('nationalParks');
  const [viewMode, setViewMode] = useState<ViewMode>('top');
  const [timeframe, setTimeframe] = useState<Timeframe>('allTime');
  const [selectedPlace, setSelectedPlace] = useState<PlaceDetails | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData | null>(null);
  const [loadingTimeSeries, setLoadingTimeSeries] = useState(false);

  const handlePlaceClick = useCallback((category: Category, id: string) => {
    const details = lookupPlace(category, id);
    setSelectedPlace(details);
  }, []);

  const getFilteredItems = (items: PopularItem[]): PopularItem[] => {
    if (viewMode === 'top') {
      return items.slice(0, 10);
    } else if (viewMode === 'bottom') {
      return items.filter(i => i.timesVisited > 0).sort((a, b) => a.timesVisited - b.timesVisited).slice(0, 10);
    } else {
      return items.filter(i => i.timesVisited === 0 && i.timesBucketListed > 0).slice(0, 20);
    }
  };

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/analytics?timeframe=${timeframe}`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const analyticsData = await response.json();
        setData(analyticsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [timeframe]);

  useEffect(() => {
    async function fetchTimeSeries() {
      setLoadingTimeSeries(true);
      try {
        const response = await fetch('/api/admin/analytics/timeseries?days=30');
        if (!response.ok) throw new Error('Failed to fetch time series');
        const tsData = await response.json();
        setTimeSeriesData(tsData);
      } catch (err) {
        console.error('Time series error:', err);
      } finally {
        setLoadingTimeSeries(false);
      }
    }
    fetchTimeSeries();
  }, []);

  const getCategoryLabel = (category: string): string => {
    return categoryLabels[category as keyof typeof categoryLabels] || category;
  };

  const getStateName = (abbr: string): string => {
    return stateNames[abbr] || abbr;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Analytics</h1>
          <p className="text-muted-foreground">
            Insights into how users are tracking their travels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeframe} onValueChange={(value) => setTimeframe(value as Timeframe)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allTime">All Time</SelectItem>
              <SelectItem value="last7Days">Last 7 Days</SelectItem>
              <SelectItem value="last30Days">Last 30 Days</SelectItem>
              <SelectItem value="previousMonth">Previous Month</SelectItem>
            </SelectContent>
          </Select>
          {data && (
            <Button
              onClick={() => {
                const categoryData = data.categoryStats.map(stat => ({
                  Category: getCategoryLabel(stat.category),
                  'Users Tracking': stat.usersTracking,
                  'Avg Visited': stat.avgVisited.toFixed(1),
                  'Avg Bucket List': stat.avgBucketList.toFixed(1),
                  'Max Visited': stat.maxVisited,
                  'Total Visits': stat.totalVisited,
                }));
                exportToCSV(categoryData, `analytics_categories_${timeframe}`);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          {error}
        </div>
      )}

      {data && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-3xl font-bold mt-1">{data.overview.totalUsers}</p>
                  </div>
                  <span className="text-2xl">👥</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-3xl font-bold mt-1">{data.overview.usersWithSelections}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {data.overview.totalUsers > 0 ? Math.round((data.overview.usersWithSelections / data.overview.totalUsers) * 100) : 0}% of total
                    </p>
                  </div>
                  <span className="text-2xl">📊</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking States</p>
                    <p className="text-3xl font-bold mt-1">{data.overview.usersTrackingStates}</p>
                  </div>
                  <span className="text-2xl">🇺🇸</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Countries</p>
                    <p className="text-3xl font-bold mt-1">{data.overview.usersTrackingCountries}</p>
                  </div>
                  <span className="text-2xl">🌍</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time Series Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>New Users</CardTitle>
                    <CardDescription>Last 30 days</CardDescription>
                  </div>
                  {timeSeriesData && (
                    <div className="text-right">
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {timeSeriesData.totals.newUsers}
                      </span>
                      <p className="text-xs text-muted-foreground">total signups</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loadingTimeSeries ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : timeSeriesData ? (
                  <TimeSeriesChart
                    data={timeSeriesData.timeseries.map(d => ({ date: d.date, value: d.newUsers }))}
                    color="#3b82f6"
                    label="users"
                    height={180}
                    showDots={timeSeriesData.timeseries.length <= 15}
                  />
                ) : (
                  <div className="flex items-center justify-center h-48 text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Activity</CardTitle>
                    <CardDescription>Items tracked per day</CardDescription>
                  </div>
                  {timeSeriesData && (
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {timeSeriesData.totals.itemsTracked.toLocaleString()}
                      </span>
                      <p className="text-xs text-muted-foreground">total items</p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {loadingTimeSeries ? (
                  <div className="flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                  </div>
                ) : timeSeriesData ? (
                  <TimeSeriesChart
                    data={timeSeriesData.timeseries.map(d => ({ date: d.date, value: d.itemsTracked }))}
                    color="#22c55e"
                    label="items"
                    height={180}
                    showDots={timeSeriesData.timeseries.length <= 15}
                  />
                ) : (
                  <div className="flex items-center justify-center h-48 text-muted-foreground">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Category Stats Table */}
          <Card>
            <CardHeader>
              <CardTitle>Category Statistics</CardTitle>
              <CardDescription>
                Breakdown by category for users who have tracked at least one item
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Users</TableHead>
                    <TableHead className="text-right">Avg Visited</TableHead>
                    <TableHead className="text-right">Avg Bucket List</TableHead>
                    <TableHead className="text-right">Max Visited</TableHead>
                    <TableHead className="text-right">Total Visits</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.categoryStats.map((stat) => (
                    <TableRow key={stat.category}>
                      <TableCell className="font-medium">{getCategoryLabel(stat.category)}</TableCell>
                      <TableCell className="text-right">{stat.usersTracking}</TableCell>
                      <TableCell className="text-right text-green-600 dark:text-green-400 font-medium">
                        {stat.avgVisited.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right text-amber-600 dark:text-amber-400">
                        {stat.avgBucketList.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">{stat.maxVisited}</TableCell>
                      <TableCell className="text-right">{stat.totalVisited}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {data.categoryStats.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No category data available yet.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Heatmaps Section */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span>🇺🇸</span> US Visitor Heatmap
                </CardTitle>
                <HeatmapLegend
                  maxValue={Math.max(...data.popularStates.map(s => s.timesVisited), 1)}
                  isDarkMode={isDarkMode}
                />
              </CardHeader>
              <CardContent className="h-[280px] p-2">
                {data.popularStates.length > 0 ? (
                  <AnalyticsUSMap data={data.popularStates} isDarkMode={isDarkMode} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">No data</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span>🌍</span> Global Visitor Heatmap
                </CardTitle>
                <HeatmapLegend
                  maxValue={Math.max(...data.popularCountries.map(c => c.timesVisited), 1)}
                  isDarkMode={isDarkMode}
                />
              </CardHeader>
              <CardContent className="h-[280px] p-2">
                {data.popularCountries.length > 0 ? (
                  <AnalyticsWorldMap data={data.popularCountries} isDarkMode={isDarkMode} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">No data</div>
                )}
              </CardContent>
            </Card>
          </div>

          <Tooltip id="analytics-tooltip" />

          {/* Category Explorer */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle>Category Explorer</CardTitle>
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_CATEGORIES.filter(cat => cat !== 'states' && cat !== 'countries').map(cat => (
                        <SelectItem key={cat} value={cat}>{getCategoryLabel(cat)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
                    <TabsList>
                      <TabsTrigger value="top">Top 10</TabsTrigger>
                      <TabsTrigger value="bottom">Hidden Gems</TabsTrigger>
                      <TabsTrigger value="zero">Unvisited</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              <CardDescription>
                {viewMode === 'top' && 'Most visited places in this category'}
                {viewMode === 'bottom' && 'Least visited places (hidden gems for newsletter challenges)'}
                {viewMode === 'zero' && 'Places on bucket lists but never visited yet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {data.popularItems && data.popularItems[selectedCategory] ? (
                (() => {
                  const filteredItems = getFilteredItems(data.popularItems[selectedCategory]);
                  return filteredItems.length > 0 ? (
                    <div className="space-y-3">
                      {filteredItems.map((item, index) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                            viewMode === 'top' && index < 3
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : viewMode === 'bottom'
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </span>
                          <button
                            onClick={() => handlePlaceClick(selectedCategory, item.id)}
                            className="flex-1 text-sm font-medium truncate text-left hover:text-primary hover:underline cursor-pointer"
                            title={`Click for details: ${item.id}`}
                          >
                            {item.id}
                          </button>
                          <span className="text-sm text-green-600 dark:text-green-400">
                            {item.timesVisited} visits
                          </span>
                          {item.timesBucketListed > 0 && (
                            <span className="text-xs text-amber-600 dark:text-amber-400">
                              +{item.timesBucketListed} bucket
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      {viewMode === 'zero' ? 'No unvisited bucket list items in this category.' : 'No data available for this category yet.'}
                    </p>
                  );
                })()
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No data available for this category yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Popular Items */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🇺🇸</span> Top 10 States
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.popularStates.length > 0 ? (
                  <div className="space-y-3">
                    {data.popularStates.slice(0, 10).map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                          index < 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium">
                          {getStateName(item.id)}
                        </span>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {item.timesVisited} visits
                        </span>
                        {item.timesBucketListed > 0 && (
                          <span className="text-xs text-amber-600 dark:text-amber-400">
                            +{item.timesBucketListed} bucket
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No state data available yet.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🌍</span> Top 10 Countries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.popularCountries.length > 0 ? (
                  <div className="space-y-3">
                    {data.popularCountries.slice(0, 10).map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                          index < 3 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="flex-1 text-sm font-medium">
                          {item.id}
                        </span>
                        <span className="text-sm text-green-600 dark:text-green-400">
                          {item.timesVisited} visits
                        </span>
                        {item.timesBucketListed > 0 && (
                          <span className="text-xs text-amber-600 dark:text-amber-400">
                            +{item.timesBucketListed} bucket
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No country data available yet.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Place Details Dialog */}
      <Dialog open={!!selectedPlace} onOpenChange={(open) => !open && setSelectedPlace(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Place Details</DialogTitle>
            <DialogDescription>{selectedPlace?.name}</DialogDescription>
          </DialogHeader>

          {selectedPlace && (
            <div className="space-y-4 py-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</p>
                <p className="text-lg font-bold mt-1">{selectedPlace.name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</p>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded mt-1">
                  {selectedPlace.id}
                </p>
              </div>
              {selectedPlace.location && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</p>
                  <p className="text-sm mt-1">{selectedPlace.location}</p>
                </div>
              )}
              {selectedPlace.type && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</p>
                  <p className="text-sm mt-1">{selectedPlace.type}</p>
                </div>
              )}
              {selectedPlace.coordinates && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Coordinates</p>
                  <p className="text-sm font-mono mt-1">
                    {selectedPlace.coordinates.lat.toFixed(4)}, {selectedPlace.coordinates.lng.toFixed(4)}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {selectedPlace?.googleMapsUrl && (
              <Button asChild>
                <a href={selectedPlace.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                  <MapPin className="w-4 h-4 mr-2" />
                  Open in Google Maps
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => {
                if (selectedPlace) navigator.clipboard.writeText(selectedPlace.name);
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Name
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
