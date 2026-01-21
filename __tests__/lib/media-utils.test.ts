import { describe, expect, it } from 'vitest';
import {
  convertToEmbedUrl,
  getMediaType,
  isValidMediaLink,
  isYouTubeEmbed,
} from '@/lib/media-utils';

describe('media-utils', () => {
  describe('getMediaType', () => {
    it('identifies YouTube watch URLs', () => {
      const result = getMediaType(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      );
      expect(result.type).toBe('youtube');
      expect(result.icon).toBe('Youtube');
      expect(result.useIframe).toBe(true);
    });

    it('identifies YouTube short URLs', () => {
      const result = getMediaType('https://youtu.be/dQw4w9WgXcQ');
      expect(result.type).toBe('youtube');
    });

    it('identifies Spotify links', () => {
      const result = getMediaType('spotify:track:4uLU6hMCjMI75M1A2tKUQC');
      expect(result.type).toBe('spotify');
      expect(result.icon).toBe('Music');
    });

    it('identifies PDF links', () => {
      const result = getMediaType('https://example.com/document.pdf');
      expect(result.type).toBe('pdf');
      expect(result.icon).toBe('FileText');
    });

    it('identifies PNG images', () => {
      const result = getMediaType('https://example.com/image.png');
      expect(result.type).toBe('image');
      expect(result.icon).toBe('Image');
    });

    it('identifies JPG images', () => {
      const result = getMediaType('https://example.com/photo.jpg');
      expect(result.type).toBe('image');
    });

    it('identifies JPEG images', () => {
      const result = getMediaType('https://example.com/photo.jpeg');
      expect(result.type).toBe('image');
    });

    it('identifies GIF images', () => {
      const result = getMediaType('https://example.com/animation.gif');
      expect(result.type).toBe('image');
    });

    it('identifies WebM videos', () => {
      const result = getMediaType('https://example.com/video.webm');
      expect(result.type).toBe('webm');
      expect(result.icon).toBe('Film');
    });

    it('identifies Google Docs', () => {
      const result = getMediaType(
        'https://docs.google.com/document/d/1234/edit',
      );
      expect(result.type).toBe('docs');
    });

    it('returns unknown for unsupported links', () => {
      const result = getMediaType('https://example.com/page');
      expect(result.type).toBe('unknown');
      expect(result.icon).toBe('X');
    });
  });

  describe('isValidMediaLink', () => {
    it('returns true for valid YouTube links', () => {
      expect(
        isValidMediaLink('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
      ).toBe(true);
    });

    it('returns true for valid image links', () => {
      expect(isValidMediaLink('https://example.com/image.png')).toBe(true);
    });

    it('returns false for invalid links', () => {
      expect(isValidMediaLink('https://example.com')).toBe(false);
    });

    it('returns false for plain text', () => {
      expect(isValidMediaLink('not a url')).toBe(false);
    });
  });

  describe('convertToEmbedUrl', () => {
    it('converts YouTube watch URLs to embed URLs', () => {
      const result = convertToEmbedUrl(
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      );
      expect(result).toBe(
        'https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1',
      );
    });

    it('converts YouTube short URLs to embed URLs', () => {
      const result = convertToEmbedUrl('https://youtu.be/dQw4w9WgXcQ');
      expect(result).toBe(
        'https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1',
      );
    });

    it('converts Spotify URIs to embed URLs', () => {
      const result = convertToEmbedUrl('spotify:track:123');
      expect(result).toContain('embed.spotify.com');
    });

    it('returns original URL for non-convertible links', () => {
      const url = 'https://example.com/image.png';
      expect(convertToEmbedUrl(url)).toBe(url);
    });
  });

  describe('isYouTubeEmbed', () => {
    it('returns true for YouTube embed URLs', () => {
      expect(isYouTubeEmbed('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(
        true,
      );
    });

    it('returns false for YouTube watch URLs', () => {
      expect(
        isYouTubeEmbed('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
      ).toBe(false);
    });

    it('returns false for non-YouTube URLs', () => {
      expect(isYouTubeEmbed('https://example.com/video')).toBe(false);
    });
  });
});
