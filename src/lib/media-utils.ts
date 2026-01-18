import type { MediaType } from '@/types/channel';

const YOUTUBE_REGEX =
  /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)/i;
const SPOTIFY_REGEX = /spotify:/i;
const PDF_REGEX = /^https?:\/\/.*\.pdf$/i;
const IMAGE_REGEX = /^https?:\/\/.*\.(gif|jpg|jpeg|png)$/i;
const WEBM_REGEX = /^https?:\/\/.*\.webm$/i;
const DOCS_REGEX = /^https:\/\/docs\.google\.com/i;

export function getMediaType(link: string): MediaType {
  if (YOUTUBE_REGEX.test(link)) {
    return { type: 'youtube', icon: 'Youtube', useIframe: true };
  }
  if (SPOTIFY_REGEX.test(link)) {
    return { type: 'spotify', icon: 'Music', useIframe: true };
  }
  if (PDF_REGEX.test(link)) {
    return { type: 'pdf', icon: 'FileText', useIframe: false };
  }
  if (IMAGE_REGEX.test(link)) {
    return { type: 'image', icon: 'Image', useIframe: false };
  }
  if (WEBM_REGEX.test(link)) {
    return { type: 'webm', icon: 'Film', useIframe: true };
  }
  if (DOCS_REGEX.test(link)) {
    return { type: 'docs', icon: 'FileText', useIframe: false };
  }
  return { type: 'unknown', icon: 'X', useIframe: false };
}

export function isValidMediaLink(link: string): boolean {
  return getMediaType(link).type !== 'unknown';
}

export function convertToEmbedUrl(link: string): string {
  // YouTube conversion
  const youtubeMatch = link.match(YOUTUBE_REGEX);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?enablejsapi=1`;
  }

  // Spotify conversion
  if (SPOTIFY_REGEX.test(link)) {
    return link.replace(SPOTIFY_REGEX, 'https://embed.spotify.com/?uri=spotify:');
  }

  return link;
}

export function isYouTubeEmbed(link: string): boolean {
  return link.startsWith('https://www.youtube.com/embed/');
}
