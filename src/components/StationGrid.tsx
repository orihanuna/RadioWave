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
}

export const StationGrid = ({
  stations,
  isLoading,
  currentStation,
  isPlaying,
  isPlayerLoading,
  onPlay,
}: StationGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center p-4 rounded-xl bg-card border border-border/50">
            <Skeleton className="w-20 h-20 rounded-lg mb-3" />
            <Skeleton className="w-24 h-4 mb-1" />
            <Skeleton className="w-16 h-3" />
          </div>
        ))}
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-lg">No stations found</p>
        <p className="text-sm">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {stations.map((station, index) => (
        <div
          key={station.stationuuid}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <StationCard
            station={station}
            isPlaying={isPlaying}
            isLoading={isPlayerLoading}
            isCurrent={currentStation?.stationuuid === station.stationuuid}
            onPlay={onPlay}
          />
        </div>
      ))}
    </div>
  );
};
