'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { executeRecaptcha, verifyRecaptcha, isRecaptchaEnabled } from '@/lib/recaptcha';
import { Globe, Lock, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

export function NewChannelForm() {
  const router = useRouter();
  const [channelName, setChannelName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (isPrivate: boolean) => {
    if (!channelName.trim()) {
      setError('Please enter a channel name');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = await executeRecaptcha('newchannel');
      const isValid = await verifyRecaptcha(token);

      if (!isValid) {
        setError('reCAPTCHA verification failed. Please try again.');
        setIsSubmitting(false);
        return;
      }

      const path = isPrivate
        ? `/channels/${encodeURIComponent(channelName.trim())}/private`
        : `/channels/${encodeURIComponent(channelName.trim())}`;

      router.push(path);
    } catch (err) {
      console.error('Error creating channel:', err);
      setError('An error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="glass rounded-3xl p-8 md:p-10 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-teal-500/20 to-violet-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gradient-ethereal mb-2">
            Create a Channel
          </h1>
          <p className="text-stone-500">
            Open a new portal for shared experiences
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Input */}
        <div className="mb-6">
          <label htmlFor="channelname" className="block text-sm font-medium text-stone-400 mb-2">
            Channel Name
          </label>
          <input
            id="channelname"
            type="text"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter a name for your channel"
            maxLength={50}
            disabled={isSubmitting}
            className="input-ethereal disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* reCAPTCHA notice */}
        {isRecaptchaEnabled() && (
          <p className="text-xs text-stone-600 mb-6 leading-relaxed">
            This site is protected by reCAPTCHA and the Google{' '}
            <a
              href="https://policies.google.com/privacy"
              className="text-teal-500/70 hover:text-teal-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="https://policies.google.com/terms"
              className="text-teal-500/70 hover:text-teal-400 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms of Service
            </a>{' '}
            apply.
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="flex-1 btn-ethereal text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Globe className="w-4 h-4" />
            )}
            <span>Public</span>
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="flex-1 btn-ghost text-stone-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            <span>Private</span>
          </button>
        </div>

        {/* Explanation */}
        <div className="mt-6 pt-6 border-t border-white/5 space-y-2 text-xs text-stone-600">
          <p>
            <span className="text-stone-400">Public:</span> Channel appears in the public list for anyone to join
          </p>
          <p>
            <span className="text-stone-400">Private:</span> Only people with the link can access the channel
          </p>
        </div>
      </div>
    </div>
  );
}
