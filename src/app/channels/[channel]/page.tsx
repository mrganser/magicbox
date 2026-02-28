import type { SharedLink } from '@/types/link';
import { ChannelView } from '@/components/channel/channel-view';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface ChannelPageProps {
  params: Promise<{ channel: string }>;
}

export async function generateMetadata({ params }: ChannelPageProps) {
  const { channel } = await params;
  return {
    title: `${decodeURIComponent(channel)} - Magic Box`,
  };
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channel } = await params;
  const decodedChannel = decodeURIComponent(channel);

  const links = await prisma.sharedLink.findMany({
    where: { channel: decodedChannel, secret: false },
    orderBy: { createdAt: 'asc' },
  });

  const serializedLinks = links.map((link: SharedLink) => ({
    id: link.id,
    channel: link.channel,
    secret: link.secret,
    link: link.link,
    createdAt: link.createdAt,
  }));

  return (
    <ChannelView
      channel={decodedChannel}
      secret={false}
      initialLinks={serializedLinks}
    />
  );
}
