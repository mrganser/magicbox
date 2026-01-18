'use client';

import { useEffect, useRef } from 'react';
import { useYouTubeSync } from '@/hooks/use-youtube-sync';
import { getMediaType, isYouTubeEmbed } from '@/lib/media-utils';
import { Share2, Sparkles } from 'lucide-react';

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
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative text-center">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-teal-500/10 to-violet-500/5 border border-white/5 flex items-center justify-center mx-auto mb-6">
            <Share2 className="w-8 h-8 text-stone-500" />
          </div>
          <h3 className="text-xl font-display font-semibold text-stone-300 mb-2">
            Share something
          </h3>
          <p className="text-stone-500 max-w-xs mx-auto">
            Paste a link below to share with everyone in this channel
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-stone-600">
            <Sparkles className="w-3 h-3" />
            <span>YouTube, Spotify, images, PDF, WebM, Google Docs</span>
          </div>
        </div>
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
        className="absolute inset-0 w-full h-full object-contain p-4"
      />
    );
  }

  // For PDFs and Google Docs - use object element
  if (mediaType.type === 'pdf' || mediaType.type === 'docs') {
    return (
      <object
        data={link}
        type={mediaType.type === 'pdf' ? 'application/pdf' : undefined}
        className="absolute inset-0 w-full h-full p-4"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-stone-400 mb-4">
              Unable to display content directly.
            </p>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ethereal text-white inline-flex items-center gap-2 text-sm"
            >
              Open in new tab
            </a>
          </div>
        </div>
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
