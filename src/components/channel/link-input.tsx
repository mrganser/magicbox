'use client';

import { CheckCircle, Loader2, Send, XCircle } from 'lucide-react';
import {
  type ClipboardEvent,
  type KeyboardEvent,
  useCallback,
  useState,
} from 'react';
import { isValidMediaLink } from '@/lib/media-utils';
import { cn } from '@/lib/utils';

interface LinkInputProps {
  onShare: (link: string) => boolean;
}

export function LinkInput({ onShare }: LinkInputProps) {
  const [link, setLink] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);

  const handleShare = useCallback(() => {
    if (!link.trim()) return;

    const success = onShare(link);

    setFeedback(success ? 'success' : 'error');
    setIsDisabled(true);

    if (success) {
      setLink('');
    }

    setTimeout(() => {
      setFeedback(null);
      setIsDisabled(false);
    }, 3000);
  }, [link, onShare]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleShare();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (isValidMediaLink(pastedText)) {
      setTimeout(handleShare, 100);
    }
  };

  return (
    <div className="border-t border-white/10 p-4 backdrop-blur-xs">
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Paste a link to share (YouTube, Spotify, images, etc.)..."
            disabled={isDisabled}
            className="input-ethereal pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {/* Feedback indicator inside input */}
          <div
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-300',
              feedback ? 'opacity-100 scale-100' : 'opacity-0 scale-75',
            )}
          >
            {feedback === 'error' && (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            {feedback === 'success' && (
              <CheckCircle className="w-5 h-5 text-teal-400" />
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleShare}
          disabled={isDisabled || !link.trim()}
          className={cn(
            'px-5 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2',
            'bg-linear-to-r from-teal-600 to-teal-700 text-white',
            'hover:from-teal-500 hover:to-teal-600',
            'shadow-lg shadow-teal-500/20 hover:shadow-teal-400/30',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none',
          )}
        >
          {isDisabled ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span>Share</span>
        </button>
      </div>

      {/* Error message */}
      {feedback === 'error' && (
        <p className="text-red-400 text-sm mt-3 flex items-center gap-2">
          <XCircle className="w-4 h-4" />
          Invalid link. Supported: YouTube, Spotify, images (gif, jpg, png),
          PDF, WebM, Google Docs
        </p>
      )}
    </div>
  );
}
