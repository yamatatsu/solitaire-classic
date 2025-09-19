# Project Structure

This project follows the Bulletproof React architecture pattern with feature-based organization.

## Directory Structure

```
src/
├── app/                    # Application-specific code and setup
│   └── (App-level components and providers)
├── assets/                 # Static assets (images, fonts, etc.)
│   └── (Images, fonts, and other static files)
├── components/             # Shared/reusable components
│   └── ui/                 # shadcn UI components
│       └── button.tsx      # Example shadcn component
├── features/               # Feature-based modules
│   └── game/              # Solitaire game feature module
│       ├── api/           # API functions (if needed)
│       ├── components/    # Game-specific components
│       ├── hooks/         # Custom React hooks for game
│       ├── stores/        # Jotai atoms for state management
│       ├── types/         # TypeScript types and interfaces
│       └── utils/         # Game logic and utility functions
├── hooks/                  # Shared React hooks
├── types/                  # Shared TypeScript types
├── utils/                  # Shared utility functions
└── lib/                   # Third-party library configurations
    └── utils.ts           # shadcn utility functions
```

## Key Technologies

- **React + TypeScript**: Core framework
- **Vite**: Build tool and dev server
- **shadcn/ui**: Component library
- **Tailwind CSS v4**: Styling framework
- **Jotai**: Atomic state management

## Import Aliases

The project is configured with the `@/` alias for the `src/` directory:
- `@/components/...` instead of `../../../components/...`
- `@/features/game/...` instead of relative imports

## Feature Module Structure

Each feature (like `game`) follows a consistent structure:
- **api/**: External API calls
- **components/**: Feature-specific UI components
- **hooks/**: Feature-specific React hooks
- **stores/**: Jotai atoms for feature state
- **types/**: TypeScript definitions
- **utils/**: Business logic and helpers

## Development Guidelines

1. Keep features isolated and self-contained
2. Shared code goes in the root directories (`/components`, `/hooks`, etc.)
3. Feature-specific code stays within the feature module
4. Use index.ts files for clean exports
5. Follow unidirectional dependencies: Shared → Features → App