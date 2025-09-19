import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'jotai';

// Custom render function for game components that need Jotai providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      {children}
    </Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Game-specific test utilities
export const gameTestUtils = {
  // Helper to create mock card data
  createMockCard: (overrides: Partial<{ suit: string; rank: number; faceUp: boolean }> = {}) => ({
    suit: 'hearts',
    rank: 1,
    faceUp: true,
    ...overrides,
  }),

  // Helper to create mock game state
  createMockGameState: () => ({
    tableau: Array(7).fill([]),
    foundations: Array(4).fill([]),
    stock: [],
    waste: [],
  }),

  // Helper to wait for state updates
  waitForStateUpdate: async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  },
};