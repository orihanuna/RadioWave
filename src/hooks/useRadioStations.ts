import { useQuery } from '@tanstack/react-query';
import { RadioStation } from '@/types/radio';

const API_SERVERS = [
  'https://de1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://at1.api.radio-browser.info',
];

const getRandomServer = () => API_SERVERS[Math.floor(Math.random() * API_SERVERS.length)];

interface FetchStationsParams {
  search?: string;
  country?: string;
  tag?: string;
  limit?: number;
  offset?: number;
}

const dedupeAndFilter = (stations: RadioStation[]): RadioStation[] => {
  const seen = new Set<string>();
  return stations.filter((station) => {
    // Must have a favicon
    if (!station.favicon) return false;
    
    // Exclude Arabic language stations
    if (station.language?.toLowerCase().includes('arabic')) return false;
    
    // Normalize name for deduplication (lowercase, remove special chars)
    const normalizedName = station.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Also dedupe by URL
    const urlKey = station.url_resolved || station.url;
    
    if (seen.has(normalizedName) || seen.has(urlKey)) {
      return false;
    }
    
    seen.add(normalizedName);
    seen.add(urlKey);
    return true;
  });
};

const fetchStations = async (params: FetchStationsParams): Promise<RadioStation[]> => {
  const server = getRandomServer();
  const { search = '', tag = '', limit = 100, offset = 0 } = params;

  let endpoint = `${server}/json/stations/search`;
  
  const queryParams = new URLSearchParams({
    limit: '200',
    offset: offset.toString(),
    order: 'clickcount',
    reverse: 'true',
    hidebroken: 'true',
    country: 'Israel',
  });

  if (search) queryParams.append('name', search);
  if (tag) queryParams.append('tag', tag);

  const response = await fetch(`${endpoint}?${queryParams}`, {
    headers: {
      'User-Agent': 'RadioApp/1.0',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stations');
  }

  const data: RadioStation[] = await response.json();
  return dedupeAndFilter(data).slice(0, limit);
};

const fetchIsraeliStations = async (limit = 100): Promise<RadioStation[]> => {
  const server = getRandomServer();
  
  const queryParams = new URLSearchParams({
    limit: '200', // Fetch more to account for filtering
    order: 'clickcount',
    reverse: 'true',
    hidebroken: 'true',
    country: 'Israel',
  });

  const response = await fetch(
    `${server}/json/stations/search?${queryParams}`,
    {
      headers: {
        'User-Agent': 'RadioApp/1.0',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch stations');
  }

  const data: RadioStation[] = await response.json();
  return dedupeAndFilter(data).slice(0, limit);
};

export const useRadioStations = (params: FetchStationsParams = {}) => {
  const hasFilters = params.search || params.tag;

  return useQuery({
    queryKey: ['stations', params],
    queryFn: () => hasFilters ? fetchStations(params) : fetchIsraeliStations(params.limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCountries = () => {
  return useQuery({
    queryKey: ['countries'],
    queryFn: async () => {
      const server = getRandomServer();
      const response = await fetch(`${server}/json/countries?order=name&hidebroken=true`);
      if (!response.ok) throw new Error('Failed to fetch countries');
      const data = await response.json();
      return data.filter((c: any) => c.stationcount > 10).slice(0, 50);
    },
    staleTime: 30 * 60 * 1000,
  });
};

export const useTags = () => {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const server = getRandomServer();
      const response = await fetch(`${server}/json/tags?order=stationcount&reverse=true&limit=30&hidebroken=true`);
      if (!response.ok) throw new Error('Failed to fetch tags');
      return response.json();
    },
    staleTime: 30 * 60 * 1000,
  });
};
