# Game Feature Module - Testing Guide

## Overview

This document outlines the Test-Driven Development (TDD) approach and testing guidelines for the solitaire game feature module.

## Testing Framework

- **Framework**: Vitest (Fast unit test framework built on Vite)
- **DOM Testing**: @testing-library/react for component testing
- **Assertions**: @testing-library/jest-dom for enhanced DOM assertions
- **Environment**: jsdom for browser-like testing environment

## Testing Structure

```
src/features/game/
├── components/
│   ├── Card.tsx
│   ├── __tests__/
│   │   └── Card.test.tsx
│   └── index.ts
├── types/
│   ├── index.ts
│   └── __tests__/
│       └── index.test.ts
├── utils/
│   ├── index.ts
│   └── __tests__/
│       └── index.test.ts
├── stores/
│   ├── index.ts
│   └── __tests__/
│       └── index.test.ts
├── hooks/
│   ├── index.ts
│   └── __tests__/
│       └── index.test.ts
└── README.md
```

## Test Utilities

### Game-Specific Test Utils (`/src/test/game-test-utils.tsx`)

- Custom render function with Jotai providers
- Game-specific utilities for creating mock data
- Helper functions for state updates and testing scenarios

### Mock Data (`/src/test/mock-data.ts`)

- Factory functions for creating test cards and game states
- Predefined test scenarios
- Utility functions for test assertions

## Testing Guidelines

### 1. Test Organization

- Each module should have a corresponding `__tests__` directory
- Test files should follow the pattern `*.test.ts` or `*.test.tsx`
- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior

### 2. Component Testing

```typescript
import { render, screen, fireEvent } from '@/test/game-test-utils';
import { Card } from '../Card';

describe('Card Component', () => {
  it('should render face up card correctly', () => {
    const mockCard = {
      suit: 'hearts',
      rank: 7,
      faceUp: true,
      id: 'hearts-7',
    };

    render(<Card card={mockCard} />);

    expect(screen.getByTestId('card-face')).toBeInTheDocument();
    expect(screen.getByText('♥')).toBeInTheDocument();
  });
});
```

### 3. Pure Function Testing

```typescript
import { hasAlternatingColors } from '../index';

describe('hasAlternatingColors', () => {
  it('should return true for red and black cards', () => {
    const redCard = { suit: 'hearts', rank: 7, faceUp: true, id: 'hearts-7' };
    const blackCard = { suit: 'spades', rank: 8, faceUp: true, id: 'spades-8' };

    expect(hasAlternatingColors(redCard, blackCard)).toBe(true);
  });
});
```

### 4. State Management Testing

For Jotai atoms and state management:

```typescript
import { render, act } from '@/test/game-test-utils';
import { useAtom } from 'jotai';

// Test atoms with custom render function that provides Jotai context
```

## Coverage Requirements

### Global Thresholds
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

### Game Feature Thresholds
- Branches: 90%
- Functions: 90%
- Lines: 90%
- Statements: 90%

## Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Run tests once (CI mode)
pnpm test:run

# Run tests with coverage
pnpm test:coverage

# Run only game feature tests
pnpm test:game
```

## TDD Workflow

1. **Red**: Write a failing test first
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve code while keeping tests green

### Example TDD Cycle

1. Write a test for a new utility function:
```typescript
it('should validate valid tableau move', () => {
  const result = isValidTableauMove(fromCard, toCard);
  expect(result).toBe(true);
});
```

2. Run test (should fail)
3. Implement minimal function:
```typescript
export const isValidTableauMove = (from: Card, to: Card): boolean => {
  // Minimal implementation to pass test
  return true;
};
```

4. Run test (should pass)
5. Refactor and add more test cases

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the code should do, not how it does it
2. **Use Descriptive Names**: Test names should clearly explain the expected behavior
3. **Arrange, Act, Assert**: Structure tests with clear setup, execution, and verification phases
4. **Test Edge Cases**: Include tests for boundary conditions and error cases
5. **Keep Tests Isolated**: Each test should be independent and not rely on other tests
6. **Mock External Dependencies**: Use mocks for external services, but avoid mocking the code under test

## Debugging Tests

- Use `test.only()` to run a specific test
- Use `test.skip()` to temporarily skip a test
- Use `console.log()` or `screen.debug()` for debugging component state
- Run tests with `--reporter=verbose` for detailed output

## Integration with CI/CD

Tests are automatically run in the GitHub Actions workflow before deployment. All tests must pass for the deployment to proceed.