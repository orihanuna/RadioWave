import { RadioStation } from '@/types/radio';
import { Play, Radio, Loader2, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StationCardProps {
  station: RadioStation;
  isPlaying: boolean;
  isLoading: boolean;
  isCurrent: boolean;
  isFavorite: boolean;
  onPlay: (station: RadioStation) => void;
  onToggleFavorite: (stationId: string) => void;
}

export const StationCard = ({ station, isPlaying, isLoading, isCurrent, isFavorite, onPlay, onToggleFavorite }: StationCardProps) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(station.stationuuid);
  };

  return (
    <button
      onClick={() => onPlay(station)}
      className={cn(
        "group relative aspect-square w-full rounded-xl transition-all duration-300 overflow-hidden",
        "bg-card hover:bg-secondary border border-border/50",
        "hover:border-primary/30 hover:shadow-lg hover:scale-105",
        isCurrent && "border-primary/50 bg-secondary glow-primary"
      )}
    >
      {/* Favorite Heart */}
      <div
        onClick={handleFavoriteClick}
        className={cn(
          "absolute top-2 left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center",
          "bg-background/80 backdrop-blur-sm transition-all hover:scale-110",
          isFavorite ? "text-red-500" : "text-muted-foreground hover:text-red-400"
        )}
      >
        <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
      </div>

      {/* Station Image */}
      <div className="absolute inset-0 flex items-center justify-center bg-muted p-2">
        {station.favicon ? (
          <img
            src={station.favicon}
            alt={station.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
              const fallback = img.nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
        ) : null}
        <span 
          className={cn(
            "text-xs font-medium text-muted-foreground text-center leading-tight",
            station.favicon && "hidden"
          )}
        >
          {station.name}
        </span>
      </div>
      
      {/* Play Overlay */}
      <div className={cn(
        "absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity",
        "group-hover:opacity-100",
        isCurrent && "opacity-100"
      )}>
        {isLoading && isCurrent ? (
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        ) : isPlaying && isCurrent ? (
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1.5 bg-primary rounded-full animate-wave"
                style={{
                  height: '20px',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        ) : (
          <Play className="w-10 h-10 text-primary fill-primary" />
        )}
      </div>
    </button>
  );
};
