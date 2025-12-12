'use client';

import { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { Category, UserSelections } from '@/lib/types';
import { getStats } from '@/lib/storage';
import { Download, Share2, Copy, Check, Loader2, ExternalLink } from 'lucide-react';

// Data Imports (Keep existing data logic)
import { countries } from '@/data/countries';
import { usStates } from '@/data/usStates';
import { usTerritories } from '@/data/usTerritories';
import { nationalParks } from '@/data/nationalParks';
import { nationalMonuments } from '@/data/nationalMonuments';
import { stateParks } from '@/data/stateParks';
import { get5000mPeaks, getUS14ers } from '@/data/mountains';
import { museums } from '@/data/museums';
import { getMlbStadiums, getNflStadiums, getNbaStadiums, getNhlStadiums, getSoccerStadiums } from '@/data/stadiums';
import { f1Tracks } from '@/data/f1Tracks';
import { marathons } from '@/data/marathons';
import { airports } from '@/data/airports';
import { skiResorts } from '@/data/skiResorts';
import { themeParks } from '@/data/themeParks';
import { surfingReserves } from '@/data/surfingReserves';
import { weirdAmericana } from '@/data/weirdAmericana';
import { usCities } from '@/data/usCities';
import { worldCities } from '@/data/worldCities';

// Hooks & Utils
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

// =====================
// O(1) Lookup Maps Logic (Preserved)
// =====================
type NamedItem = { id?: string; code?: string; name: string };

function createNameMap<T extends NamedItem>(items: T[], keyField: 'id' | 'code' = 'id'): Map<string, string> {
  return new Map(items.map(item => [item[keyField] as string, item.name]));
}

const countriesNameMap = createNameMap(countries, 'code');
const usStatesNameMap = createNameMap(usStates, 'code');
const usTerritoriesNameMap = createNameMap(usTerritories, 'code');
const nationalParksNameMap = createNameMap(nationalParks);
const nationalMonumentsNameMap = createNameMap(nationalMonuments);
const stateParksNameMap = createNameMap(stateParks);
const museumsNameMap = createNameMap(museums);
const f1TracksNameMap = createNameMap(f1Tracks);
const marathonsNameMap = createNameMap(marathons);
const airportsNameMap = createNameMap(airports);
const skiResortsNameMap = createNameMap(skiResorts);
const themeParksNameMap = createNameMap(themeParks);
const surfingReservesNameMap = createNameMap(surfingReserves);
const weirdAmericanaNameMap = createNameMap(weirdAmericana);

let fiveKPeaksNameMap: Map<string, string> | null = null;
let fourteenersNameMap: Map<string, string> | null = null;
let mlbStadiumsNameMap: Map<string, string> | null = null;
let nflStadiumsNameMap: Map<string, string> | null = null;
let nbaStadiumsNameMap: Map<string, string> | null = null;
let nhlStadiumsNameMap: Map<string, string> | null = null;
let soccerStadiumsNameMap: Map<string, string> | null = null;

function getFiveKPeaksNameMap() { if (!fiveKPeaksNameMap) fiveKPeaksNameMap = createNameMap(get5000mPeaks()); return fiveKPeaksNameMap; }
function getFourteenersNameMap() { if (!fourteenersNameMap) fourteenersNameMap = createNameMap(getUS14ers()); return fourteenersNameMap; }
function getMlbStadiumsNameMap() { if (!mlbStadiumsNameMap) mlbStadiumsNameMap = createNameMap(getMlbStadiums()); return mlbStadiumsNameMap; }
function getNflStadiumsNameMap() { if (!nflStadiumsNameMap) nflStadiumsNameMap = createNameMap(getNflStadiums()); return nflStadiumsNameMap; }
function getNbaStadiumsNameMap() { if (!nbaStadiumsNameMap) nbaStadiumsNameMap = createNameMap(getNbaStadiums()); return nbaStadiumsNameMap; }
function getNhlStadiumsNameMap() { if (!nhlStadiumsNameMap) nhlStadiumsNameMap = createNameMap(getNhlStadiums()); return nhlStadiumsNameMap; }
function getSoccerStadiumsNameMap() { if (!soccerStadiumsNameMap) soccerStadiumsNameMap = createNameMap(getSoccerStadiums()); return soccerStadiumsNameMap; }

const categoryTotals: Record<Category, number> = {
  countries: countries.length,
  states: usStates.length,
  territories: usTerritories.length,
  usCities: usCities.length,
  worldCities: worldCities.length,
  nationalParks: nationalParks.length,
  nationalMonuments: nationalMonuments.length,
  stateParks: stateParks.length,
  fiveKPeaks: get5000mPeaks().length,
  fourteeners: getUS14ers().length,
  museums: museums.length,
  mlbStadiums: getMlbStadiums().length,
  nflStadiums: getNflStadiums().length,
  nbaStadiums: getNbaStadiums().length,
  nhlStadiums: getNhlStadiums().length,
  soccerStadiums: getSoccerStadiums().length,
  f1Tracks: f1Tracks.length,
  marathons: marathons.length,
  airports: airports.length,
  skiResorts: skiResorts.length,
  themeParks: themeParks.length,
  surfingReserves: surfingReserves.length,
  weirdAmericana: weirdAmericana.length,
};

function getVisitedItemNames(selections: UserSelections, category: Category): string[] {
  let nameMap: Map<string, string>;
  switch (category) {
    case 'countries': nameMap = countriesNameMap; break;
    case 'states': nameMap = usStatesNameMap; break;
    case 'territories': nameMap = usTerritoriesNameMap; break;
    case 'nationalParks': nameMap = nationalParksNameMap; break;
    case 'nationalMonuments': nameMap = nationalMonumentsNameMap; break;
    case 'stateParks': nameMap = stateParksNameMap; break;
    case 'fiveKPeaks': nameMap = getFiveKPeaksNameMap(); break;
    case 'fourteeners': nameMap = getFourteenersNameMap(); break;
    case 'museums': nameMap = museumsNameMap; break;
    case 'mlbStadiums': nameMap = getMlbStadiumsNameMap(); break;
    case 'nflStadiums': nameMap = getNflStadiumsNameMap(); break;
    case 'nbaStadiums': nameMap = getNbaStadiumsNameMap(); break;
    case 'nhlStadiums': nameMap = getNhlStadiumsNameMap(); break;
    case 'soccerStadiums': nameMap = getSoccerStadiumsNameMap(); break;
    case 'f1Tracks': nameMap = f1TracksNameMap; break;
    case 'marathons': nameMap = marathonsNameMap; break;
    case 'airports': nameMap = airportsNameMap; break;
    case 'skiResorts': nameMap = skiResortsNameMap; break;
    case 'themeParks': nameMap = themeParksNameMap; break;
    case 'surfingReserves': nameMap = surfingReservesNameMap; break;
    case 'weirdAmericana': nameMap = weirdAmericanaNameMap; break;
    default: return [];
  }

  return selections[category]
    .filter(s => s.status === 'visited')
    .map(s => nameMap.get(s.id))
    .filter((name): name is string => name !== undefined);
}

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

  const { isDownloading, downloadImage, shareOrCopyImage } = useShareImage({
    cardRef,
    category,
  });

  const stats = useMemo(
    () => getStats(selections, category, categoryTotals[category]),
    [selections, category]
  );

  const visitedItems = useMemo(
    () => getVisitedItemNames(selections, category),
    [selections, category]
  );

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
          <div className="relative rounded-lg overflow-hidden border shadow-sm bg-muted/20 flex justify-center">
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
            disabled={isDownloading}
            className="w-full sm:w-auto"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={downloadImage}
            disabled={isDownloading}
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
