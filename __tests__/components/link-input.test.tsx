import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LinkInput } from '@/components/channel/link-input';

describe('LinkInput', () => {
  it('renders input and share button', () => {
    render(<LinkInput onShare={() => true} />);

    expect(
      screen.getByPlaceholderText(/paste a link to share/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
  });

  it('calls onShare when button is clicked', () => {
    const onShare = vi.fn(() => true);
    render(<LinkInput onShare={onShare} />);

    const input = screen.getByPlaceholderText(/paste a link to share/i);
    fireEvent.change(input, {
      target: { value: 'https://youtube.com/watch?v=test' },
    });

    const button = screen.getByRole('button', { name: /share/i });
    fireEvent.click(button);

    expect(onShare).toHaveBeenCalledWith('https://youtube.com/watch?v=test');
  });

  it('calls onShare when Enter key is pressed', () => {
    const onShare = vi.fn(() => true);
    render(<LinkInput onShare={onShare} />);

    const input = screen.getByPlaceholderText(/paste a link to share/i);
    fireEvent.change(input, {
      target: { value: 'https://youtube.com/watch?v=test' },
    });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onShare).toHaveBeenCalledWith('https://youtube.com/watch?v=test');
  });

  it('clears input after successful share', () => {
    const onShare = vi.fn(() => true);
    render(<LinkInput onShare={onShare} />);

    const input = screen.getByPlaceholderText(
      /paste a link to share/i
    ) as HTMLInputElement;
    fireEvent.change(input, {
      target: { value: 'https://youtube.com/watch?v=test' },
    });

    const button = screen.getByRole('button', { name: /share/i });
    fireEvent.click(button);

    expect(input.value).toBe('');
  });

  it('does not call onShare with empty input', () => {
    const onShare = vi.fn(() => true);
    render(<LinkInput onShare={onShare} />);

    const button = screen.getByRole('button', { name: /share/i });
    fireEvent.click(button);

    expect(onShare).not.toHaveBeenCalled();
  });

  it('disables button when input is empty', () => {
    render(<LinkInput onShare={() => true} />);

    const button = screen.getByRole('button', { name: /share/i });
    expect(button).toBeDisabled();
  });

  it('enables button when input has value', () => {
    render(<LinkInput onShare={() => true} />);

    const input = screen.getByPlaceholderText(/paste a link to share/i);
    fireEvent.change(input, { target: { value: 'test' } });

    const button = screen.getByRole('button', { name: /share/i });
    expect(button).not.toBeDisabled();
  });

  it('shows error message when onShare returns false', async () => {
    const onShare = vi.fn(() => false);
    render(<LinkInput onShare={onShare} />);

    const input = screen.getByPlaceholderText(/paste a link to share/i);
    fireEvent.change(input, { target: { value: 'invalid link' } });

    const button = screen.getByRole('button', { name: /share/i });
    fireEvent.click(button);

    expect(await screen.findByText(/invalid link/i)).toBeInTheDocument();
  });
});
