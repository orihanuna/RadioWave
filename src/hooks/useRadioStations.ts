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

const fetchStations = async (params: FetchStationsParams): Promise<RadioStation[]> => {
  const server = getRandomServer();
  const { search = '', country = '', tag = '', limit = 50, offset = 0 } = params;

  let endpoint = `${server}/json/stations/search`;
  
  const queryParams = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    order: 'clickcount',
    reverse: 'true',
    hidebroken: 'true',
  });

  if (search) queryParams.append('name', search);
  if (country) queryParams.append('country', country);
  if (tag) queryParams.append('tag', tag);

  const response = await fetch(`${endpoint}?${queryParams}`, {
    headers: {
      'User-Agent': 'RadioApp/1.0',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stations');
  }

  return response.json();
};

const fetchTopStations = async (limit = 50): Promise<RadioStation[]> => {
  const server = getRandomServer();
  
  const response = await fetch(
    `${server}/json/stations/topclick/${limit}?hidebroken=true`,
    {
      headers: {
        'User-Agent': 'RadioApp/1.0',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch top stations');
  }

  return response.json();
};

export const useRadioStations = (params: FetchStationsParams = {}) => {
  const hasFilters = params.search || params.country || params.tag;

  return useQuery({
    queryKey: ['stations', params],
    queryFn: () => hasFilters ? fetchStations(params) : fetchTopStations(params.limit),
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
