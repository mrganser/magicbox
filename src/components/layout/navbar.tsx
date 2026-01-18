import Link from 'next/link';
import { Box, Sparkles } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
            <div className="relative">
              <Box className="h-6 w-6 text-violet-400 group-hover:text-violet-300 transition-colors" />
              <Sparkles className="h-3 w-3 text-amber-400 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Magic Box
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/channels"
              className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
            >
              Channels
            </Link>
            <Link
              href="/newchannel"
              className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white px-4 py-1.5 rounded-full font-medium text-sm transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40"
            >
              New Channel
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
