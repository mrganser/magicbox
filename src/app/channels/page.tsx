import { Hash, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getPublicChannels(): Promise<string[]> {
  const results = await prisma.sharedLink.findMany({
    where: { secret: false },
    distinct: ['channel'],
    select: { channel: true },
    orderBy: { createdAt: 'desc' },
  });

  return results.map((r: { channel: string }) => r.channel);
}

export default async function ChannelsPage() {
  const channels = await getPublicChannels();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] relative">
      {/* Ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gradient-ethereal mb-2">
              Public Channels
            </h1>
            <p className="text-stone-500">
              Join an existing gathering or create your own
            </p>
          </div>
          <Link
            href="/newchannel"
            className="btn-ethereal text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Channel</span>
          </Link>
        </div>

        {/* Channel Grid */}
        {channels.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-teal-500/20 to-violet-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-teal-400" />
            </div>
            <h2 className="text-2xl font-display font-semibold text-stone-200 mb-3">
              No channels yet
            </h2>
            <p className="text-stone-500 mb-8">
              Be the first to create a public channel and start sharing.
            </p>
            <Link
              href="/newchannel"
              className="btn-ethereal text-white inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Channel</span>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((channel, index) => (
              <Link
                key={channel}
                href={`/channels/${encodeURIComponent(channel)}`}
                className="group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="glass card-lift rounded-2xl p-6 border border-white/5 group-hover:border-teal-500/30 group-hover:glow-soft transition-all duration-500">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-teal-500/20 to-violet-500/10 border border-teal-500/20 flex items-center justify-center group-hover:border-teal-400/40 transition-colors">
                      <Hash className="w-6 h-6 text-teal-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-display font-semibold text-stone-100 truncate group-hover:text-teal-200 transition-colors">
                        {channel}
                      </h3>
                      <p className="text-sm text-stone-500 mt-1">
                        Click to join
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
