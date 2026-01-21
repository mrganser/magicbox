import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NewChannelForm } from '@/components/forms/new-channel-form';

// Mock recaptcha module
vi.mock('@/lib/recaptcha', () => ({
  executeRecaptcha: vi.fn(() => Promise.resolve('mock-token')),
  verifyRecaptcha: vi.fn(() => Promise.resolve(true)),
  isRecaptchaEnabled: vi.fn(() => false),
}));

// Get mocked router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}));

describe('NewChannelForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form with input and buttons', () => {
    render(<NewChannelForm />);

    expect(screen.getByLabelText(/channel name/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter a name for your channel/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /public/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /private/i })).toBeInTheDocument();
  });

  it('shows error when submitting with empty channel name', async () => {
    render(<NewChannelForm />);

    const publicButton = screen.getByRole('button', { name: /public/i });
    fireEvent.click(publicButton);

    expect(
      await screen.findByText(/please enter a channel name/i)
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('shows error when submitting with whitespace-only channel name', async () => {
    render(<NewChannelForm />);

    const input = screen.getByPlaceholderText(/enter a name for your channel/i);
    fireEvent.change(input, { target: { value: '   ' } });

    const publicButton = screen.getByRole('button', { name: /public/i });
    fireEvent.click(publicButton);

    expect(
      await screen.findByText(/please enter a channel name/i)
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('creates a public channel and navigates to it', async () => {
    render(<NewChannelForm />);

    const input = screen.getByPlaceholderText(/enter a name for your channel/i);
    fireEvent.change(input, { target: { value: 'my-test-channel' } });

    const publicButton = screen.getByRole('button', { name: /public/i });
    fireEvent.click(publicButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/channels/my-test-channel');
    });
  });

  it('creates a private channel and navigates to it', async () => {
    render(<NewChannelForm />);

    const input = screen.getByPlaceholderText(/enter a name for your channel/i);
    fireEvent.change(input, { target: { value: 'secret-channel' } });

    const privateButton = screen.getByRole('button', { name: /private/i });
    fireEvent.click(privateButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/channels/secret-channel/private');
    });
  });

  it('encodes special characters in channel name', async () => {
    render(<NewChannelForm />);

    const input = screen.getByPlaceholderText(/enter a name for your channel/i);
    fireEvent.change(input, { target: { value: 'my channel/test' } });

    const publicButton = screen.getByRole('button', { name: /public/i });
    fireEvent.click(publicButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        '/channels/my%20channel%2Ftest'
      );
    });
  });

  it('trims whitespace from channel name', async () => {
    render(<NewChannelForm />);

    const input = screen.getByPlaceholderText(/enter a name for your channel/i);
    fireEvent.change(input, { target: { value: '  trimmed-channel  ' } });

    const publicButton = screen.getByRole('button', { name: /public/i });
    fireEvent.click(publicButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/channels/trimmed-channel');
    });
  });

  it('disables buttons while submitting', async () => {
    render(<NewChannelForm />);

    const input = screen.getByPlaceholderText(/enter a name for your channel/i);
    fireEvent.change(input, { target: { value: 'test-channel' } });

    const publicButton = screen.getByRole('button', { name: /public/i });
    const privateButton = screen.getByRole('button', { name: /private/i });

    fireEvent.click(publicButton);

    // Buttons should be disabled during submission
    expect(publicButton).toBeDisabled();
    expect(privateButton).toBeDisabled();
    expect(input).toBeDisabled();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });
  });

  it('shows error when reCAPTCHA verification fails', async () => {
    const { verifyRecaptcha } = await import('@/lib/recaptcha');
    vi.mocked(verifyRecaptcha).mockResolvedValueOnce(false);

    render(<NewChannelForm />);

    const input = screen.getByPlaceholderText(/enter a name for your channel/i);
    fireEvent.change(input, { target: { value: 'test-channel' } });

    const publicButton = screen.getByRole('button', { name: /public/i });
    fireEvent.click(publicButton);

    expect(
      await screen.findByText(/recaptcha verification failed/i)
    ).toBeInTheDocument();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
