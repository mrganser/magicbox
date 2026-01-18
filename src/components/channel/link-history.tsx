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

export function LinkHistory({
  links,
  currentLink,
  onLinkClick,
}: LinkHistoryProps) {
  if (links.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 p-4 text-center">
        <p>No links shared yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <ul className="space-y-1 p-2">
        {links.map((item) => {
          const mediaType = getMediaType(item.link);
          const IconComponent = iconMap[mediaType.icon] || LinkIcon;
          const isActive = item.link === currentLink;

          return (
            <li
              key={item.id}
              className={cn(
                'px-3 py-2.5 rounded-lg cursor-pointer transition-all',
                'hover:bg-slate-800',
                isActive && 'bg-violet-500/20 border border-violet-500/30'
              )}
              onClick={() => onLinkClick(item.link)}
            >
              <div className="flex items-center gap-2 text-slate-200 text-sm">
                <IconComponent className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isActive ? "text-violet-400" : "text-slate-400"
                )} />
                <span className="truncate">
                  {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm')}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-1 pl-6">
                {mediaType.type}
              </p>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
