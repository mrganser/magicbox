'use client';

import { useEffect, useRef } from 'react';
import { useYouTubeSync } from '@/hooks/use-youtube-sync';
import { getMediaType, isYouTubeEmbed } from '@/lib/media-utils';
import { Share2 } from 'lucide-react';

interface MediaViewerProps {
  link: string | null;
  channel: string;
}

export function MediaViewer({ link, channel }: MediaViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { initializePlayer } = useYouTubeSync({ channel, currentLink: link });

  useEffect(() => {
    if (link && isYouTubeEmbed(link) && iframeRef.current) {
      // Small delay to ensure iframe is loaded
      const timer = setTimeout(() => {
        initializePlayer('media-iframe');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [link, initializePlayer]);

  if (!link) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 gap-4">
        <Share2 className="h-16 w-16" />
        <p className="text-lg">Share a link to get started</p>
        <p className="text-sm text-white/40">
          Supported: YouTube, Spotify, images, PDF, WebM, Google Docs
        </p>
      </div>
    );
  }

  const mediaType = getMediaType(link);

  // For images
  if (mediaType.type === 'image') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={link}
        alt="Shared content"
        className="absolute inset-0 w-full h-full object-contain p-2"
      />
    );
  }

  // For PDFs and Google Docs - use object element
  if (mediaType.type === 'pdf' || mediaType.type === 'docs') {
    return (
      <object
        data={link}
        type={mediaType.type === 'pdf' ? 'application/pdf' : undefined}
        className="absolute inset-0 w-full h-full p-2"
      >
        <p className="text-white text-center mt-4">
          Unable to display content.{' '}
          <a href={link} target="_blank" rel="noopener noreferrer" className="underline">
            Open in new tab
          </a>
        </p>
      </object>
    );
  }

  // For iframe-based content (YouTube, Spotify, WebM)
  return (
    <iframe
      id="media-iframe"
      ref={iframeRef}
      src={link}
      className="absolute inset-0 w-full h-full"
      allowFullScreen
      allow="autoplay; encrypted-media; fullscreen"
    />
  );
}
