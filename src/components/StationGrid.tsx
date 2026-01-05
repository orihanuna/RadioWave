import { RadioStation } from '@/types/radio';
import { StationCard } from './StationCard';
import { Skeleton } from '@/components/ui/skeleton';

interface StationGridProps {
  stations: RadioStation[];
  isLoading: boolean;
  currentStation: RadioStation | null;
  isPlaying: boolean;
  isPlayerLoading: boolean;
  onPlay: (station: RadioStation) => void;
  favorites: Set<string>;
  onToggleFavorite: (stationId: string) => void;
}

export const StationGrid = ({
  stations,
  isLoading,
  currentStation,
  isPlaying,
  isPlayerLoading,
  onPlay,
  favorites,
  onToggleFavorite,
}: StationGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {Array.from({ length: 24 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg">לא נמצאו תחנות</p>
        <p className="text-sm">נסה לשנות את החיפוש</p>
      </div>
    );
  }

  // Sort: favorites first
  const sortedStations = [...stations].sort((a, b) => {
    const aFav = favorites.has(a.stationuuid) ? 0 : 1;
    const bFav = favorites.has(b.stationuuid) ? 0 : 1;
    return aFav - bFav;
  });

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3">
      {sortedStations.map((station, index) => (
        <div
          key={station.stationuuid}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 20}ms` }}
        >
          <StationCard
            station={station}
            isPlaying={isPlaying}
            isLoading={isPlayerLoading}
            isCurrent={currentStation?.stationuuid === station.stationuuid}
            isFavorite={favorites.has(station.stationuuid)}
            onPlay={onPlay}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}
    </div>
  );
};
