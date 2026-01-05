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

  // Callbacks for next/previous (set by parent component)
  const onNextRef = useRef<(() => void) | null>(null);
  const onPreviousRef = useRef<(() => void) | null>(null);

  const setMediaSessionHandlers = useCallback((onNext: () => void, onPrevious: () => void) => {
    onNextRef.current = onNext;
    onPreviousRef.current = onPrevious;
  }, []);

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

  // Update Media Session metadata when station changes
  useEffect(() => {
    if ('mediaSession' in navigator && playerState.currentStation) {
      const station = playerState.currentStation;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: station.name,
        artist: station.country || 'Radio',
        album: 'RadioWave',
        artwork: station.favicon ? [
          { src: station.favicon, sizes: '96x96', type: 'image/png' },
          { src: station.favicon, sizes: '128x128', type: 'image/png' },
          { src: station.favicon, sizes: '256x256', type: 'image/png' },
        ] : []
      });
    }
  }, [playerState.currentStation]);

  // Set up Media Session action handlers
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        audioRef.current?.play();
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        audioRef.current?.pause();
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        onPreviousRef.current?.();
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        onNextRef.current?.();
      });
    }
  }, []);

  // Update playback state for Media Session
  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = playerState.isPlaying ? 'playing' : 'paused';
    }
  }, [playerState.isPlaying]);

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
    setMediaSessionHandlers,
  };
};
