# Solitaire Classic - Project Overview

## Purpose
A classic solitaire game implementation built with React and TypeScript, following bulletproof-react patterns.

## Tech Stack
- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 7
- **Testing**: Vitest with coverage
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **State Management**: Jotai
- **Code Quality**: Biome (linting/formatting), Husky (git hooks)
- **Package Manager**: pnpm

## Project Structure
- `src/` - Main source code
- `src/features/` - Feature-based architecture (bulletproof-react pattern)
- `src/components/` - Shared UI components
- Path aliases: `@/*` maps to `./src/*`

## Key Dependencies
- **UI**: @radix-ui/react-slot, lucide-react, class-variance-authority
- **State**: jotai
- **Testing**: @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
- **Build**: @vitejs/plugin-react, typescript