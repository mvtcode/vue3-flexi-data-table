import 'regenerator-runtime/runtime';
import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock window methods
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Config for @vue/test-utils
config.global.stubs = {
  transition: false,
  'vue3-popper': true
};

config.global.mocks = {
  $t: (key: string) => key,
}; 