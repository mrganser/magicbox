'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '@/contexts/socket-context';
import { convertToEmbedUrl, isValidMediaLink } from '@/lib/media-utils';
import type { SharedLink } from '@/types/link';

interface UseChannelOptions {
  channel: string;
  secret: boolean;
  initialLinks: SharedLink[];
}

function playNotificationSound() {
  const audio = new Audio('/sounds/notification.ogg');
  audio.play().catch(() => {
    // Ignore autoplay restrictions
  });
}

export function useChannel({
  channel,
  secret,
  initialLinks,
}: UseChannelOptions) {
  const { socket } = useSocket();
  const [links, setLinks] = useState<SharedLink[]>(initialLinks);
  const [currentLink, setCurrentLink] = useState<string | null>(
    initialLinks.length > 0 ? initialLinks[initialLinks.length - 1].link : null,
  );

  useEffect(() => {
    if (!socket) return;

    const handleLinkShared = (
      eventChannel: string,
      eventSecret: boolean,
      link: string,
      date: Date,
    ) => {
      if (eventChannel === channel && eventSecret === secret) {
        const newLink: SharedLink = {
          id: crypto.randomUUID(),
          channel: eventChannel,
          secret: eventSecret,
          link,
          createdAt: date,
        };
        setLinks((prev) => [...prev, newLink]);
        setCurrentLink(link);
        playNotificationSound();
      }
    };

    const handleLinkChanged = (
      eventChannel: string,
      eventSecret: boolean,
      link: string,
    ) => {
      if (eventChannel === channel && eventSecret === secret) {
        setCurrentLink(link);
      }
    };

    socket.on('linkshared', handleLinkShared);
    socket.on('linkchanged', handleLinkChanged);

    return () => {
      socket.off('linkshared', handleLinkShared);
      socket.off('linkchanged', handleLinkChanged);
    };
  }, [socket, channel, secret]);

  const shareLink = useCallback(
    (rawLink: string): boolean => {
      if (!socket || !isValidMediaLink(rawLink)) return false;

      const embedLink = convertToEmbedUrl(rawLink);
      socket.emit('linkshared', channel, secret, embedLink);
      return true;
    },
    [socket, channel, secret],
  );

  const changeLink = useCallback(
    (link: string) => {
      if (!socket) return;
      setCurrentLink(link);
      socket.emit('linkchanged', channel, secret, link);
    },
    [socket, channel, secret],
  );

  return { links, currentLink, shareLink, changeLink };
}
