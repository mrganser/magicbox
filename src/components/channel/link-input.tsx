'use client';

import { useState, useCallback, type KeyboardEvent, type ClipboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Send } from 'lucide-react';
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
    <div className="border-t border-slate-800 p-4 bg-slate-900/80">
      <div className="flex gap-3 items-center">
        <Input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder="Paste a link to share (YouTube, Spotify, images, etc.)..."
          disabled={isDisabled}
          className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-violet-500/20"
        />
        <Button
          onClick={handleShare}
          disabled={isDisabled || !link.trim()}
          className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white gap-2 shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:shadow-none"
        >
          <Send className="h-4 w-4" />
          Share
        </Button>
        <div
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-lg transition-all',
            feedback === 'error' && 'bg-red-500/20 border border-red-500/50',
            feedback === 'success' && 'bg-green-500/20 border border-green-500/50',
            !feedback && 'opacity-0'
          )}
        >
          {feedback === 'error' && <XCircle className="h-5 w-5 text-red-400" />}
          {feedback === 'success' && (
            <CheckCircle className="h-5 w-5 text-green-400" />
          )}
        </div>
      </div>
      {feedback === 'error' && (
        <p className="text-red-400 text-sm mt-2">
          Invalid link. Supported: YouTube, Spotify, images (gif, jpg, png), PDF, WebM,
          Google Docs
        </p>
      )}
    </div>
  );
}
