import { useState, useMemo } from 'react';
import { useRadioStations } from '@/hooks/useRadioStations';
import { useRadioPlayer } from '@/hooks/useRadioPlayer';
import { useFavorites } from '@/hooks/useFavorites';
import { useTheme } from '@/hooks/useTheme';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { StationGrid } from '@/components/StationGrid';
import { PlayerBar } from '@/components/PlayerBar';
import { useDebounce } from '@/hooks/useDebounce';

const Index = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const { data: stations = [], isLoading } = useRadioStations({
    search: debouncedSearch,
  });

  const {
    currentStation,
    isPlaying,
    isLoading: isPlayerLoading,
    volume,
    playStation,
    togglePlay,
    setVolume,
    stop,
  } = useRadioPlayer();

  const { favorites, toggleFavorite } = useFavorites();
  const { theme, updateTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header theme={theme} onThemeChange={updateTheme} />

      <main className="container mx-auto px-4 py-6 pb-32">
        {/* Search */}
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* Stations Grid */}
        <div className="mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            {debouncedSearch ? `תוצאות עבור "${debouncedSearch}"` : 'תחנות'}
          </h2>
        </div>

        <StationGrid
          stations={stations}
          isLoading={isLoading}
          currentStation={currentStation}
          isPlaying={isPlaying}
          isPlayerLoading={isPlayerLoading}
          onPlay={playStation}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </main>

      {/* Player Bar */}
      <PlayerBar
        station={currentStation}
        isPlaying={isPlaying}
        isLoading={isPlayerLoading}
        volume={volume}
        onTogglePlay={togglePlay}
        onVolumeChange={setVolume}
        onStop={stop}
      />
    </div>
  );
};

export default Index;
