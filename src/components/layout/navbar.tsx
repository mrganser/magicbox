import Link from 'next/link';
import { Sparkles, Plus } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-[hsl(240,20%,13%)] shadow-xl shadow-black/50" />
      <div className="absolute inset-0 bg-linear-to-b from-white/6 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-teal-400/50 to-transparent" />
      <div className="absolute inset-x-0 -bottom-8 h-8 bg-linear-to-b from-black/20 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-teal-400/30 rounded-sm blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-8 h-8 rounded-sm bg-linear-to-br from-teal-500/30 to-teal-600/20 border border-teal-500/30 flex items-center justify-center group-hover:border-teal-400/50 transition-colors">
                <Sparkles className="w-4 h-4 text-teal-300" />
              </div>
            </div>
            <span className="text-lg font-display font-semibold text-gradient-ethereal">
              Magic Box
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <Link
              href="/channels"
              className="px-4 py-2 text-stone-400 hover:text-white transition-colors text-sm font-medium rounded-lg hover:bg-white/5"
            >
              Channels
            </Link>
            <Link
              href="/newchannel"
              className="ml-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-teal-600 hover:bg-teal-500 transition-all duration-300 flex items-center gap-2 shadow-md shadow-teal-900/50"
            >
              <Plus className="w-4 h-4" />
              <span>New Channel</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
