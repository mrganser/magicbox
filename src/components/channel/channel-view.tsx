'use client';

import { useChannel } from '@/hooks/use-channel';
import { MediaViewer } from './media-viewer';
import { LinkHistory } from './link-history';
import { LinkInput } from './link-input';
import type { SharedLink } from '@/types/link';
import { Lock, Hash, Users } from 'lucide-react';

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
    <div className="flex h-[calc(100vh-3.5rem)] relative">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[80px]" />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Channel header */}
        <div className="px-6 py-4 flex items-center gap-4 border-b border-white/10 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-teal-500/20 to-violet-500/10 border border-teal-500/20 flex items-center justify-center">
              <Hash className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-xl font-display font-semibold text-stone-100">{channel}</h2>
              <div className="flex items-center gap-2 text-xs text-stone-500">
                {secret ? (
                  <>
                    <Lock className="w-3 h-3" />
                    <span>Private channel</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3 h-3" />
                    <span>Public channel</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Media viewer */}
        <div className="flex-1 p-4">
          <div className="relative h-full rounded-2xl overflow-hidden glass border border-white/5">
            <MediaViewer key={currentLink} link={currentLink} channel={channel} />
          </div>
        </div>

        {/* Link input */}
        <LinkInput onShare={shareLink} />
      </div>

      {/* Sidebar - Link History */}
      <div className="w-80 flex flex-col border-l border-white/10 backdrop-blur-xs relative z-10">
        <div className="px-4 py-4 border-b border-white/10">
          <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
            Shared Links
          </h3>
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
