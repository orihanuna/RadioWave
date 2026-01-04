import { useState, useMemo } from 'react';
import { useRadioStations, useCountries, useTags } from '@/hooks/useRadioStations';
import { useRadioPlayer } from '@/hooks/useRadioPlayer';
import { Header } from '@/components/Header';
import { SearchBar } from '@/components/SearchBar';
import { FilterChips } from '@/components/FilterChips';
import { StationGrid } from '@/components/StationGrid';
import { PlayerBar } from '@/components/PlayerBar';
import { useDebounce } from '@/hooks/useDebounce';

const Index = () => {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const { data: stations = [], isLoading } = useRadioStations({
    search: debouncedSearch,
    country: selectedCountry,
    tag: selectedTag,
  });

  const { data: countries = [] } = useCountries();
  const { data: tags = [] } = useTags();

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

  const topCountries = useMemo(() => {
    return countries.slice(0, 15);
  }, [countries]);

  const topTags = useMemo(() => {
    return tags.slice(0, 15);
  }, [tags]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 pb-32">
        {/* Search */}
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          <FilterChips
            items={topTags}
            selected={selectedTag}
            onSelect={(tag) => {
              setSelectedTag(tag);
              setSelectedCountry('');
            }}
            label="Genres"
          />
          <FilterChips
            items={topCountries}
            selected={selectedCountry}
            onSelect={(country) => {
              setSelectedCountry(country);
              setSelectedTag('');
            }}
            label="Countries"
          />
        </div>

        {/* Stations Grid */}
        <div className="mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            {debouncedSearch
              ? `Results for "${debouncedSearch}"`
              : selectedTag
              ? `${selectedTag} Stations`
              : selectedCountry
              ? `Stations from ${selectedCountry}`
              : 'Popular Stations'}
          </h2>
        </div>

        <StationGrid
          stations={stations}
          isLoading={isLoading}
          currentStation={currentStation}
          isPlaying={isPlaying}
          isPlayerLoading={isPlayerLoading}
          onPlay={playStation}
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
