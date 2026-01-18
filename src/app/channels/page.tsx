import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hash, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getPublicChannels() {
  const results = await prisma.sharedLink.findMany({
    where: { secret: false },
    distinct: ['channel'],
    select: { channel: true },
    orderBy: { createdAt: 'desc' },
  });

  return results.map((r) => r.channel);
}

export default async function ChannelsPage() {
  const channels = await getPublicChannels();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Public Channels</h1>
          <Button asChild className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 shadow-lg shadow-violet-500/25">
            <Link href="/newchannel">
              <Plus className="h-4 w-4 mr-2" />
              New Channel
            </Link>
          </Button>
        </div>

        {channels.length === 0 ? (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="py-12 text-center">
              <p className="text-slate-400 mb-4">
                No public channels yet. Be the first to create one!
              </p>
              <Button asChild className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 shadow-lg shadow-violet-500/25">
                <Link href="/newchannel">Create Channel</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((channel) => (
              <Link key={channel} href={`/channels/${encodeURIComponent(channel)}`}>
                <Card className="bg-slate-900/50 border-slate-800 hover:border-violet-500/50 transition-all cursor-pointer h-full group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Hash className="h-5 w-5 text-violet-400 group-hover:text-violet-300" />
                      {channel}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-400">
                      Click to join this channel
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
