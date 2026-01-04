import { useState, useRef, useCallback, useEffect } from 'react';
import { RadioStation, PlayerState } from '@/types/radio';

export const useRadioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentStation: null,
    isPlaying: false,
    volume: 0.7,
    isLoading: false,
  });

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = playerState.volume;

    const audio = audioRef.current;

    audio.addEventListener('playing', () => {
      setPlayerState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
    });

    audio.addEventListener('pause', () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    });

    audio.addEventListener('waiting', () => {
      setPlayerState(prev => ({ ...prev, isLoading: true }));
    });

    audio.addEventListener('error', () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false, isLoading: false }));
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const playStation = useCallback((station: RadioStation) => {
    if (!audioRef.current) return;

    const streamUrl = station.url_resolved || station.url;
    
    if (playerState.currentStation?.stationuuid === station.stationuuid && playerState.isPlaying) {
      audioRef.current.pause();
      return;
    }

    setPlayerState(prev => ({ ...prev, currentStation: station, isLoading: true }));
    audioRef.current.src = streamUrl;
    audioRef.current.play().catch(() => {
      setPlayerState(prev => ({ ...prev, isLoading: false }));
    });
  }, [playerState.currentStation, playerState.isPlaying]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !playerState.currentStation) return;

    if (playerState.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }, [playerState.isPlaying, playerState.currentStation]);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    setPlayerState(prev => ({ ...prev, volume }));
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.src = '';
    setPlayerState(prev => ({ ...prev, currentStation: null, isPlaying: false }));
  }, []);

  return {
    ...playerState,
    playStation,
    togglePlay,
    setVolume,
    stop,
  };
};
