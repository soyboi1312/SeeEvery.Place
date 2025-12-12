'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Category, UserSelections } from '@/lib/types';
import { getStats } from '@/lib/storage';
import { Download, Share2, Copy, Check, Loader2, ExternalLink } from 'lucide-react';

// Optimized Imports
import { categoryTotals, getCategoryItemsAsync, type CategoryItem } from '@/lib/categoryUtils';
import { useShareImage } from '@/lib/hooks/useShareImage';
import { ShareableMapDesign, gradients, usesRegionMap, detectMilestones } from './share';
import type { MarkerSize } from './MapMarkers';

// Shadcn UI Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface ShareCardProps {
  selections: UserSelections;
  category: Category;
  subcategory?: string;
  onClose: () => void;
  isPublicProfile?: boolean;
  username?: string | null;
}

export default function ShareCard({ selections, category, subcategory, onClose, isPublicProfile, username }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedGradient, setSelectedGradient] = useState(0);
  const [includeMap, setIncludeMap] = useState(true);
  const [iconSize, setIconSize] = useState<MarkerSize>('small');
  const [linkCopied, setLinkCopied] = useState(false);

  // State for dynamically loaded items
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { isDownloading, downloadImage, shareOrCopyImage } = useShareImage({
    cardRef,
    category,
  });

  // Load category data on mount to get item names
  useEffect(() => {
    let isMounted = true;
    setIsDataLoaded(false);

    getCategoryItemsAsync(category).then((items) => {
      if (isMounted) {
        setCategoryItems(items);
        setIsDataLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [category]);

  const stats = useMemo(
    () => getStats(selections, category, categoryTotals[category]),
    [selections, category]
  );

  // Compute visited items names from loaded data
  const visitedItems = useMemo(() => {
    if (!isDataLoaded) return [];

    // Create a local O(1) map for the current category
    const nameMap = new Map(categoryItems.map(item => [item.id, item.name]));

    return selections[category]
      .filter(s => s.status === 'visited')
      .map(s => nameMap.get(s.id))
      .filter((name): name is string => name !== undefined);
  }, [selections, category, categoryItems, isDataLoaded]);

  const milestones = useMemo(
    () => detectMilestones(stats.visited, stats.total, stats.percentage, category),
    [stats.visited, stats.total, stats.percentage, category]
  );

  const handleCopyLink = async () => {
    const link = `https://seeevery.place/u/${username}`;
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Fallback mostly for mobile if clipboard api fails
      const textarea = document.createElement('textarea');
      textarea.value = link;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Share Your Map</DialogTitle>
          <DialogDescription>
            Customize and download your travel stats card.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Controls Section */}
          <div className="space-y-4">
            {/* Color Picker */}
            <div className="space-y-2">
              <Label>Choose a style</Label>
              <div className="flex flex-wrap gap-2">
                {gradients.map((gradient, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedGradient(index)}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} transition-all ${
                      selectedGradient === index
                        ? 'ring-2 ring-offset-2 ring-primary scale-110'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    aria-label={`Select gradient ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Map Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                <Label htmlFor="map-toggle" className="flex flex-col gap-1 cursor-pointer">
                  <span>Include Map</span>
                  <span className="font-normal text-xs text-muted-foreground">Show map snapshot</span>
                </Label>
                <Switch
                  id="map-toggle"
                  checked={includeMap}
                  onCheckedChange={setIncludeMap}
                />
              </div>

              {includeMap && !usesRegionMap(category) && (
                <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg">
                  <Label className="flex flex-col gap-1">
                    <span>Icon Size</span>
                    <span className="font-normal text-xs text-muted-foreground">Adjust marker scale</span>
                  </Label>
                  <Tabs value={iconSize} onValueChange={(v) => setIconSize(v as MarkerSize)} className="h-8">
                    <TabsList className="h-8">
                      <TabsTrigger value="small" className="text-xs px-2 h-6">Small</TabsTrigger>
                      <TabsTrigger value="default" className="text-xs px-2 h-6">Large</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}
            </div>
          </div>

          {/* Card Preview */}
          <div className="relative rounded-lg overflow-hidden border shadow-sm bg-muted/20 flex justify-center min-h-[300px] items-center">
            {/* Show loading spinner while data names are being fetched */}
            {!isDataLoaded ? (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm">Preparing data...</span>
              </div>
            ) : (
              <div className="scale-[0.85] sm:scale-100 origin-center transition-transform duration-200">
                <ShareableMapDesign
                  ref={cardRef}
                  selections={selections}
                  category={category}
                  subcategory={subcategory}
                  stats={stats}
                  visitedItems={visitedItems}
                  selectedGradient={selectedGradient}
                  includeMap={includeMap}
                  iconSize={iconSize}
                  milestones={milestones}
                />
              </div>
            )}
          </div>

          {/* Public Link Section */}
          <Separator />

          <div className="space-y-3">
            {isPublicProfile && username ? (
              <div className="space-y-2">
                <Label className="text-green-600 dark:text-green-400 flex items-center gap-1.5">
                   <ExternalLink className="w-3.5 h-3.5" /> Your Public Link
                </Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`https://seeevery.place/u/${username}`}
                    className="bg-muted font-mono text-xs"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="icon"
                    className={linkCopied ? "text-green-600 border-green-600" : ""}
                  >
                    {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">Want a live link?</h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Enable your public profile to share a live version of this map.</p>
                </div>
                <Button variant="secondary" size="sm" asChild className="shrink-0">
                  <Link href="/settings">Enable</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={shareOrCopyImage}
            disabled={isDownloading || !isDataLoaded}
            className="w-full sm:w-auto"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={downloadImage}
            disabled={isDownloading || !isDataLoaded}
            className="w-full sm:w-auto"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? 'Generating...' : 'Download Image'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
