import { RadioStation } from '@/types/radio';
import { Play, Pause, Volume2, VolumeX, X, Radio, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface PlayerBarProps {
  station: RadioStation | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  onTogglePlay: () => void;
  onVolumeChange: (volume: number) => void;
  onStop: () => void;
}

export const PlayerBar = ({
  station,
  isPlaying,
  isLoading,
  volume,
  onTogglePlay,
  onVolumeChange,
  onStop,
}: PlayerBarProps) => {
  if (!station) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "glass border-t border-border/30",
      "animate-fade-in"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Station Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
              {station.favicon ? (
                <img
                  src={station.favicon}
                  alt={station.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <Radio className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-foreground truncate">
                {station.name}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {station.country} {station.bitrate > 0 && `• ${station.bitrate}kbps`}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "w-12 h-12 rounded-full",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                isPlaying && "animate-pulse-glow"
              )}
              onClick={onTogglePlay}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </Button>
          </div>

          {/* Volume */}
          <div className="hidden sm:flex items-center gap-2 w-32">
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8"
              onClick={() => onVolumeChange(volume === 0 ? 0.7 : 0)}
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </Button>
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={([val]) => onVolumeChange(val / 100)}
              className="w-20"
            />
          </div>

          {/* Close */}
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8 text-muted-foreground hover:text-foreground"
            onClick={onStop}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
