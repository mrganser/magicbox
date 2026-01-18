import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Socket.IO client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    connected: true,
  })),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}));

// Mock crypto.randomUUID
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(7),
    },
  });
}

// Mock Audio
class MockAudio {
  play() {
    return Promise.resolve();
  }
}
vi.stubGlobal('Audio', MockAudio);
