import { prisma } from '@/lib/prisma';
import type { SharedLink } from '@prisma/client';
import { ChannelView } from '@/components/channel/channel-view';

export const dynamic = 'force-dynamic';

interface PrivateChannelPageProps {
  params: Promise<{ channel: string }>;
}

export async function generateMetadata({ params }: PrivateChannelPageProps) {
  const { channel } = await params;
  return {
    title: `${decodeURIComponent(channel)} (Private) - Magic Box`,
  };
}

export default async function PrivateChannelPage({
  params,
}: PrivateChannelPageProps) {
  const { channel } = await params;
  const decodedChannel = decodeURIComponent(channel);

  const links = await prisma.sharedLink.findMany({
    where: { channel: decodedChannel, secret: true },
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
      secret={true}
      initialLinks={serializedLinks}
    />
  );
}
