import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChannelView } from '@/components/channel/channel-view';
import type { SharedLink } from '@/types/link';

// Create a mock socket with trackable methods
const mockEmit = vi.fn();
const mockOn = vi.fn();
const mockOff = vi.fn();

const mockSocket = {
  on: mockOn,
  off: mockOff,
  emit: mockEmit,
  disconnect: vi.fn(),
  connected: true,
};

// Mock the socket context
vi.mock('@/contexts/socket-context', () => ({
  useSocket: () => ({
    socket: mockSocket,
    isConnected: true,
  }),
  SocketProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const createMockLink = (overrides: Partial<SharedLink> = {}): SharedLink => ({
  id: `test-id-${Math.random().toString(36).substring(7)}`,
  channel: 'test-channel',
  secret: false,
  link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  createdAt: new Date('2024-01-15T10:30:00'),
  ...overrides,
});

describe('ChannelView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders channel header with channel name', () => {
    render(
      <ChannelView channel="my-channel" secret={false} initialLinks={[]} />,
    );

    expect(screen.getByText('my-channel')).toBeInTheDocument();
    expect(screen.getByText(/public channel/i)).toBeInTheDocument();
  });

  it('shows private channel indicator for secret channels', () => {
    render(
      <ChannelView channel="secret-room" secret={true} initialLinks={[]} />,
    );

    expect(screen.getByText('secret-room')).toBeInTheDocument();
    expect(screen.getByText(/private channel/i)).toBeInTheDocument();
  });

  it('renders the link input component', () => {
    render(
      <ChannelView channel="test-channel" secret={false} initialLinks={[]} />,
    );

    expect(
      screen.getByPlaceholderText(/paste a link to share/i),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('shows "Shared Links" section header', () => {
    render(
      <ChannelView channel="test-channel" secret={false} initialLinks={[]} />,
    );

    expect(screen.getByText(/shared links/i)).toBeInTheDocument();
  });

  it('shows empty state when no links are shared', () => {
    render(
      <ChannelView channel="test-channel" secret={false} initialLinks={[]} />,
    );

    expect(screen.getByText(/no links shared yet/i)).toBeInTheDocument();
  });

  it('renders initial links in the link history', () => {
    const initialLinks: SharedLink[] = [
      createMockLink({
        id: '1',
        link: 'https://www.youtube.com/watch?v=video123456',
      }),
      createMockLink({
        id: '2',
        link: 'spotify:track:123456789012',
      }),
    ];

    render(
      <ChannelView
        channel="test-channel"
        secret={false}
        initialLinks={initialLinks}
      />,
    );

    expect(screen.getByText('youtube')).toBeInTheDocument();
    expect(screen.getByText('spotify')).toBeInTheDocument();
  });

  it('emits linkshared event when sharing a valid YouTube link', async () => {
    render(
      <ChannelView channel="test-channel" secret={false} initialLinks={[]} />,
    );

    const input = screen.getByPlaceholderText(/paste a link to share/i);
    fireEvent.change(input, {
      target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    });

    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockEmit).toHaveBeenCalledWith(
        'linkshared',
        'test-channel',
        false,
        'https://www.youtube.com/embed/dQw4w9WgXcQ?enablejsapi=1',
      );
    });
  });

  it('emits linkshared event with secret flag for private channels', async () => {
    render(
      <ChannelView channel="private-room" secret={true} initialLinks={[]} />,
    );

    const input = screen.getByPlaceholderText(/paste a link to share/i);
    fireEvent.change(input, {
      target: { value: 'https://www.youtube.com/watch?v=test1234567' },
    });

    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockEmit).toHaveBeenCalledWith(
        'linkshared',
        'private-room',
        true,
        'https://www.youtube.com/embed/test1234567?enablejsapi=1',
      );
    });
  });

  it('clears input after successful share', async () => {
    render(
      <ChannelView channel="test-channel" secret={false} initialLinks={[]} />,
    );

    const input = screen.getByPlaceholderText(
      /paste a link to share/i,
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    });

    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('shows error for invalid links', async () => {
    render(
      <ChannelView channel="test-channel" secret={false} initialLinks={[]} />,
    );

    const input = screen.getByPlaceholderText(/paste a link to share/i);
    fireEvent.change(input, {
      target: { value: 'not-a-valid-url' },
    });

    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    // Should show error state (X icon becomes visible)
    expect(await screen.findByText(/invalid link/i)).toBeInTheDocument();

    // Should not emit socket event for invalid link
    expect(mockEmit).not.toHaveBeenCalled();
  });

  it('emits linkchanged event when clicking a link in history', async () => {
    const initialLinks: SharedLink[] = [
      createMockLink({
        id: '1',
        link: 'https://www.youtube.com/watch?v=video123456',
      }),
      createMockLink({
        id: '2',
        link: 'https://www.youtube.com/watch?v=video789012',
      }),
    ];

    render(
      <ChannelView
        channel="test-channel"
        secret={false}
        initialLinks={initialLinks}
      />,
    );

    // Click on the first link in history
    const listItems = screen.getAllByRole('listitem');
    fireEvent.click(listItems[0]);

    await waitFor(() => {
      expect(mockEmit).toHaveBeenCalledWith(
        'linkchanged',
        'test-channel',
        false,
        'https://www.youtube.com/watch?v=video123456',
      );
    });
  });

  it('sets up socket event listeners on mount', () => {
    render(
      <ChannelView channel="test-channel" secret={false} initialLinks={[]} />,
    );

    expect(mockOn).toHaveBeenCalledWith('linkshared', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('linkchanged', expect.any(Function));
  });

  it('removes socket event listeners on unmount', () => {
    const { unmount } = render(
      <ChannelView channel="test-channel" secret={false} initialLinks={[]} />,
    );

    unmount();

    expect(mockOff).toHaveBeenCalledWith('linkshared', expect.any(Function));
    expect(mockOff).toHaveBeenCalledWith('linkchanged', expect.any(Function));
  });

  it('converts YouTube short URLs to embed URLs when sharing', async () => {
    render(
      <ChannelView channel="test-channel" secret={false} initialLinks={[]} />,
    );

    const input = screen.getByPlaceholderText(/paste a link to share/i);
    fireEvent.change(input, {
      target: { value: 'https://youtu.be/shortcode12' },
    });

    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockEmit).toHaveBeenCalledWith(
        'linkshared',
        'test-channel',
        false,
        'https://www.youtube.com/embed/shortcode12?enablejsapi=1',
      );
    });
  });

  it('handles Spotify URI links correctly', async () => {
    render(
      <ChannelView channel="test-channel" secret={false} initialLinks={[]} />,
    );

    const input = screen.getByPlaceholderText(/paste a link to share/i);
    fireEvent.change(input, {
      target: { value: 'spotify:track:4uLU6hMCjMI75M1A2tKUQC' },
    });

    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    await waitFor(() => {
      expect(mockEmit).toHaveBeenCalledWith(
        'linkshared',
        'test-channel',
        false,
        'https://embed.spotify.com/?uri=spotify:track:4uLU6hMCjMI75M1A2tKUQC',
      );
    });
  });

  it('selects the most recent link as current on initial load', () => {
    const initialLinks: SharedLink[] = [
      createMockLink({
        id: '1',
        link: 'https://www.youtube.com/watch?v=olderVideo1',
        createdAt: new Date('2024-01-15T09:00:00'),
      }),
      createMockLink({
        id: '2',
        link: 'https://www.youtube.com/watch?v=newerVideo2',
        createdAt: new Date('2024-01-15T10:00:00'),
      }),
    ];

    render(
      <ChannelView
        channel="test-channel"
        secret={false}
        initialLinks={initialLinks}
      />,
    );

    // The second (newer) link should be highlighted as current
    const listItems = screen.getAllByRole('listitem');
    expect(listItems[1]).toHaveClass('bg-teal-500/10');
    expect(listItems[0]).not.toHaveClass('bg-teal-500/10');
  });
});
