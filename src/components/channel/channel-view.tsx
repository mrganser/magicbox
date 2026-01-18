'use client';

import { useChannel } from '@/hooks/use-channel';
import { MediaViewer } from './media-viewer';
import { LinkHistory } from './link-history';
import { LinkInput } from './link-input';
import type { SharedLink } from '@/types/link';
import { Badge } from '@/components/ui/badge';
import { Lock, Hash } from 'lucide-react';

interface ChannelViewProps {
  channel: string;
  secret: boolean;
  initialLinks: SharedLink[];
}

export function ChannelView({
  channel,
  secret,
  initialLinks,
}: ChannelViewProps) {
  const { links, currentLink, shareLink, changeLink } = useChannel({
    channel,
    secret,
    initialLinks,
  });

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-slate-950">
      <div className="flex-1 flex flex-col">
        <div className="p-4 flex items-center gap-3 border-b border-slate-800">
          <Hash className="h-5 w-5 text-violet-400" />
          <h2 className="text-xl font-bold text-white">{channel}</h2>
          {secret && (
            <Badge variant="secondary" className="gap-1 bg-slate-800 text-slate-300 border-slate-700">
              <Lock className="h-3 w-3" />
              Private
            </Badge>
          )}
        </div>
        <div className="flex-1 relative bg-slate-900 m-4 rounded-xl overflow-hidden border border-slate-800">
          <MediaViewer link={currentLink} channel={channel} />
        </div>
        <LinkInput onShare={shareLink} />
      </div>
      <div className="w-80 flex flex-col border-l border-slate-800 bg-slate-900/50">
        <div className="p-4 text-center border-b border-slate-800">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Link History</h2>
        </div>
        <LinkHistory
          links={links}
          currentLink={currentLink}
          onLinkClick={changeLink}
        />
      </div>
    </div>
  );
}
