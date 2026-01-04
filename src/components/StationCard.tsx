import { RadioStation } from '@/types/radio';
import { Play, Radio, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StationCardProps {
  station: RadioStation;
  isPlaying: boolean;
  isLoading: boolean;
  isCurrent: boolean;
  onPlay: (station: RadioStation) => void;
}

export const StationCard = ({ station, isPlaying, isLoading, isCurrent, onPlay }: StationCardProps) => {
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
      {/* Station Image */}
      <div className="absolute inset-0 flex items-center justify-center bg-muted">
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
            "w-10 h-10 text-muted-foreground",
            station.favicon && "hidden"
          )} 
        />
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
