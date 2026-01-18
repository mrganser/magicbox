'use client';

import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMediaType } from '@/lib/media-utils';
import { cn } from '@/lib/utils';
import {
  Youtube,
  Music,
  FileText,
  Image,
  Film,
  Link as LinkIcon,
  X,
} from 'lucide-react';
import type { SharedLink } from '@/types/link';

interface LinkHistoryProps {
  links: SharedLink[];
  currentLink: string | null;
  onLinkClick: (link: string) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Youtube,
  Music,
  FileText,
  Image,
  Film,
  Link: LinkIcon,
  X,
};

const colorMap: Record<string, string> = {
  Youtube: 'text-red-400',
  Music: 'text-green-400',
  FileText: 'text-cyan-400',
  Image: 'text-amber-400',
  Film: 'text-violet-400',
  Link: 'text-stone-400',
};

export function LinkHistory({
  links,
  currentLink,
  onLinkClick,
}: LinkHistoryProps) {
  if (links.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div>
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-teal-500/10 to-violet-500/5 border border-white/5 flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="w-5 h-5 text-stone-500" />
          </div>
          <p className="text-stone-500 text-sm">No links shared yet</p>
          <p className="text-stone-600 text-xs mt-1">Share something to get started</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <ul className="p-2 space-y-1">
        {links.map((item) => {
          const mediaType = getMediaType(item.link);
          const IconComponent = iconMap[mediaType.icon] || LinkIcon;
          const iconColor = colorMap[mediaType.icon] || 'text-stone-400';
          const isActive = item.link === currentLink;

          return (
            <li
              key={item.id}
              className={cn(
                'px-3 py-3 rounded-xl cursor-pointer transition-all duration-300',
                'hover:bg-white/3',
                isActive && 'bg-teal-500/10 border border-teal-500/20 glow-soft'
              )}
              onClick={() => onLinkClick(item.link)}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                    isActive
                      ? 'bg-teal-500/20 border border-teal-500/30'
                      : 'bg-white/3 border border-white/5'
                  )}
                >
                  <IconComponent
                    className={cn(
                      'w-4 h-4',
                      isActive ? 'text-teal-400' : iconColor
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-sm font-medium truncate transition-colors',
                      isActive ? 'text-teal-200' : 'text-stone-300'
                    )}
                  >
                    {mediaType.type}
                  </p>
                  <p className="text-xs text-stone-600 truncate">
                    {format(new Date(item.createdAt), 'MMM d, HH:mm')}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
