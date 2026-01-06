import { RadioStation } from '@/types/radio';
import { Play, Pause, Volume2, VolumeX, X, Radio, Loader2, SkipBack, SkipForward } from 'lucide-react';
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
  onPrevious: () => void;
  onNext: () => void;
}

export const PlayerBar = ({
  station,
  isPlaying,
  isLoading,
  volume,
  onTogglePlay,
  onVolumeChange,
  onStop,
  onPrevious,
  onNext,
}: PlayerBarProps) => {
  if (!station) return null;

  return (
    <div className={c(
      "fixed bottom-15 left-4 right-4 z-50",
      "glass border border-border/30 rounded-2xl",
      "animate-fade-in"
    )}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4" dir="rtl">
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
          <div className="flex items-center gap-1">
            {/* Previous */}
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 rounded-full text-foreground hover:bg-secondary"
              onClick={onPrevious}
            >
              <SkipBack className="w-5 h-5" />
            </Button>

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

            {/* Next */}
            <Button
              size="icon"
              variant="ghost"
              className="w-10 h-10 rounded-full text-foreground hover:bg-secondary"
              onClick={onNext}
            >
              <SkipForward className="w-5 h-5" />
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
