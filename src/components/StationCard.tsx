import { RadioStation } from '@/types/radio';
import { Play, Pause, Radio, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StationCardProps {
  station: RadioStation;
  isPlaying: boolean;
  isLoading: boolean;
  isCurrent: boolean;
  onPlay: (station: RadioStation) => void;
}

export const StationCard = ({ station, isPlaying, isLoading, isCurrent, onPlay }: StationCardProps) => {
  const tags = station.tags?.split(',').filter(Boolean).slice(0, 2) || [];

  return (
    <button
      onClick={() => onPlay(station)}
      className={cn(
        "group relative flex flex-col items-center p-4 rounded-xl transition-all duration-300",
        "bg-card hover:bg-secondary border border-border/50",
        "hover:border-primary/30 hover:shadow-lg hover:-translate-y-1",
        isCurrent && "border-primary/50 bg-secondary glow-primary"
      )}
    >
      {/* Station Image */}
      <div className="relative w-20 h-20 mb-3 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        {station.favicon ? (
          <img
            src={station.favicon}
            alt={station.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <Radio 
          className={cn(
            "w-8 h-8 text-muted-foreground",
            station.favicon && "hidden"
          )} 
        />
        
        {/* Play Overlay */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity",
          "group-hover:opacity-100",
          isCurrent && "opacity-100"
        )}>
          {isLoading && isCurrent ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          ) : isPlaying && isCurrent ? (
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-wave"
                  style={{
                    height: '16px',
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          ) : (
            <Play className="w-8 h-8 text-primary fill-primary" />
          )}
        </div>
      </div>

      {/* Station Info */}
      <h3 className="text-sm font-medium text-foreground text-center line-clamp-2 mb-1">
        {station.name}
      </h3>
      
      <p className="text-xs text-muted-foreground mb-2">
        {station.country || 'Unknown'}
      </p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 justify-center">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Bitrate */}
      {station.bitrate > 0 && (
        <span className="absolute top-2 right-2 text-[10px] text-muted-foreground">
          {station.bitrate}kbps
        </span>
      )}
    </button>
  );
};
