'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSocket } from '@/contexts/socket-context';
import { isYouTubeEmbed } from '@/lib/media-utils';

interface UseYouTubeSyncOptions {
  channel: string;
  currentLink: string | null;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
        CUED: number;
        UNSTARTED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayer {
  getCurrentTime: () => number;
  getPlayerState: () => number;
  seekTo: (seconds: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  destroy: () => void;
}

export function useYouTubeSync({
  channel,
  currentLink,
}: UseYouTubeSyncOptions) {
  const { socket } = useSocket();
  const playerRef = useRef<YTPlayer | null>(null);
  const playerReadyRef = useRef(false);
  const comesFromSocketRef = useRef(false);
  const [isReady, setIsReady] = useState(
    () => typeof window !== 'undefined' && !!window.YT,
  );

  // Load YouTube API
  useEffect(() => {
    if (typeof window === 'undefined' || isReady) return;

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (existingScript) return;

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => setIsReady(true);
  }, [isReady]);

  // Initialize player when ready and link is YouTube
  const initializePlayer = useCallback(
    (iframeId: string) => {
      if (!isReady || !currentLink || !isYouTubeEmbed(currentLink)) return;

      // Destroy existing player
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore errors from destroying non-existent player
        }
        playerRef.current = null;
        playerReadyRef.current = false;
      }

      playerRef.current = new window.YT.Player(iframeId, {
        events: {
          onReady: () => {
            playerReadyRef.current = true;
          },
          onStateChange: (event) => {
            if (comesFromSocketRef.current) {
              if (
                event.data === window.YT.PlayerState.PLAYING ||
                event.data === window.YT.PlayerState.PAUSED
              ) {
                comesFromSocketRef.current = false;
              }
              return;
            }

            if (!socket) return;

            switch (event.data) {
              case window.YT.PlayerState.PLAYING:
                socket.emit(
                  'playvideo',
                  channel,
                  playerRef.current?.getCurrentTime() ?? 0,
                );
                break;
              case window.YT.PlayerState.PAUSED:
                socket.emit(
                  'pausevideo',
                  channel,
                  playerRef.current?.getCurrentTime() ?? 0,
                );
                break;
            }
          },
        },
      });
    },
    [isReady, currentLink, socket, channel],
  );

  // Handle socket events for sync
  useEffect(() => {
    if (!socket) return;

    const handlePlay = (eventChannel: string, time: number) => {
      if (
        eventChannel !== channel ||
        !playerRef.current ||
        !playerReadyRef.current
      )
        return;
      if (
        playerRef.current.getPlayerState() !== window.YT.PlayerState.PLAYING
      ) {
        comesFromSocketRef.current = true;
        playerRef.current.seekTo(time);
        playerRef.current.playVideo();
      }
    };

    const handlePause = (eventChannel: string, time: number) => {
      if (
        eventChannel !== channel ||
        !playerRef.current ||
        !playerReadyRef.current
      )
        return;
      if (
        playerRef.current.getPlayerState() === window.YT.PlayerState.PLAYING
      ) {
        comesFromSocketRef.current = true;
        playerRef.current.seekTo(time);
        playerRef.current.pauseVideo();
      }
    };

    socket.on('playvideo', handlePlay);
    socket.on('pausevideo', handlePause);

    return () => {
      socket.off('playvideo', handlePlay);
      socket.off('pausevideo', handlePause);
    };
  }, [socket, channel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Ignore
        }
        playerRef.current = null;
        playerReadyRef.current = false;
      }
    };
  }, []);

  return { initializePlayer, isYouTubeReady: isReady };
}
