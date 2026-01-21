import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LinkHistory } from '@/components/channel/link-history';
import type { SharedLink } from '@/types/link';

// YouTube video IDs must be exactly 11 characters
const createMockLink = (overrides: Partial<SharedLink> = {}): SharedLink => ({
  id: 'test-id-' + Math.random().toString(36).substring(7),
  channel: 'test-channel',
  secret: false,
  link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  createdAt: new Date('2024-01-15T10:30:00'),
  ...overrides,
});

describe('LinkHistory', () => {
  it('shows empty state when no links are shared', () => {
    render(
      <LinkHistory links={[]} currentLink={null} onLinkClick={vi.fn()} />
    );

    expect(screen.getByText(/no links shared yet/i)).toBeInTheDocument();
    expect(screen.getByText(/share something to get started/i)).toBeInTheDocument();
  });

  it('renders a list of shared links', () => {
    const links: SharedLink[] = [
      createMockLink({
        id: '1',
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        createdAt: new Date('2024-01-15T10:30:00'),
      }),
      createMockLink({
        id: '2',
        link: 'spotify:track:123',
        createdAt: new Date('2024-01-15T11:00:00'),
      }),
    ];

    render(
      <LinkHistory links={links} currentLink={null} onLinkClick={vi.fn()} />
    );

    // Should show media type labels (lowercase as returned by getMediaType)
    expect(screen.getByText('youtube')).toBeInTheDocument();
    expect(screen.getByText('spotify')).toBeInTheDocument();
  });

  it('displays timestamps for each link', () => {
    const links: SharedLink[] = [
      createMockLink({
        id: '1',
        createdAt: new Date('2024-01-15T10:30:00'),
      }),
    ];

    render(
      <LinkHistory links={links} currentLink={null} onLinkClick={vi.fn()} />
    );

    expect(screen.getByText(/Jan 15, 10:30/i)).toBeInTheDocument();
  });

  it('calls onLinkClick when a link is clicked', () => {
    const onLinkClick = vi.fn();
    const links: SharedLink[] = [
      createMockLink({
        id: '1',
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }),
    ];

    render(
      <LinkHistory
        links={links}
        currentLink={null}
        onLinkClick={onLinkClick}
      />
    );

    const linkItem = screen.getByText('youtube').closest('li');
    expect(linkItem).toBeInTheDocument();
    fireEvent.click(linkItem!);

    expect(onLinkClick).toHaveBeenCalledWith(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    );
  });

  it('highlights the currently selected link', () => {
    const currentLink = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const links: SharedLink[] = [
      createMockLink({
        id: '1',
        link: currentLink,
      }),
      createMockLink({
        id: '2',
        link: 'https://www.youtube.com/watch?v=xvFZjo5PgG0',
      }),
    ];

    render(
      <LinkHistory
        links={links}
        currentLink={currentLink}
        onLinkClick={vi.fn()}
      />
    );

    const listItems = screen.getAllByRole('listitem');

    // First item should have the active styling class
    expect(listItems[0]).toHaveClass('bg-teal-500/10');
    expect(listItems[1]).not.toHaveClass('bg-teal-500/10');
  });

  it('renders different media type icons correctly', () => {
    const links: SharedLink[] = [
      createMockLink({
        id: '1',
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }),
      createMockLink({
        id: '2',
        link: 'spotify:track:123',
      }),
      createMockLink({
        id: '3',
        link: 'https://example.com/document.pdf',
      }),
      createMockLink({
        id: '4',
        link: 'https://example.com/image.jpg',
      }),
    ];

    render(
      <LinkHistory links={links} currentLink={null} onLinkClick={vi.fn()} />
    );

    expect(screen.getByText('youtube')).toBeInTheDocument();
    expect(screen.getByText('spotify')).toBeInTheDocument();
    expect(screen.getByText('pdf')).toBeInTheDocument();
    expect(screen.getByText('image')).toBeInTheDocument();
  });

  it('renders multiple links in order', () => {
    const links: SharedLink[] = [
      createMockLink({
        id: '1',
        link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        createdAt: new Date('2024-01-15T09:00:00'),
      }),
      createMockLink({
        id: '2',
        link: 'https://www.youtube.com/watch?v=xvFZjo5PgG0',
        createdAt: new Date('2024-01-15T10:00:00'),
      }),
      createMockLink({
        id: '3',
        link: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
        createdAt: new Date('2024-01-15T11:00:00'),
      }),
    ];

    render(
      <LinkHistory links={links} currentLink={null} onLinkClick={vi.fn()} />
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);

    // Check timestamps are in order
    expect(listItems[0]).toHaveTextContent('09:00');
    expect(listItems[1]).toHaveTextContent('10:00');
    expect(listItems[2]).toHaveTextContent('11:00');
  });
});
