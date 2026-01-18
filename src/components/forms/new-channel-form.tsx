'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { executeRecaptcha, verifyRecaptcha } from '@/lib/recaptcha';
import { Globe, Lock, AlertCircle } from 'lucide-react';

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
    <Card className="max-w-md mx-auto bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Create a New Channel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/30 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label htmlFor="channelname" className="text-sm font-medium text-slate-300">
            Channel Name
          </label>
          <Input
            id="channelname"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            placeholder="Enter a name for your channel"
            maxLength={50}
            disabled={isSubmitting}
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500"
          />
        </div>

        <p className="text-xs text-slate-500">
          This site is protected by reCAPTCHA and the Google{' '}
          <a
            href="https://policies.google.com/privacy"
            className="underline hover:text-slate-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            className="underline hover:text-slate-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>{' '}
          apply.
        </p>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 shadow-lg shadow-violet-500/20"
          >
            <Globe className="h-4 w-4 mr-2" />
            Public
          </Button>
          <Button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            variant="secondary"
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
          >
            <Lock className="h-4 w-4 mr-2" />
            Private
          </Button>
        </div>

        <div className="text-xs text-slate-500 space-y-1">
          <p>
            <strong className="text-slate-400">Public:</strong> Channel will appear in the public list
          </p>
          <p>
            <strong className="text-slate-400">Private:</strong> Only people with the link can access
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
