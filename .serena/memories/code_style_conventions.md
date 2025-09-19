# Code Style and Conventions

## Biome Configuration
- **Indentation**: 2 spaces
- **Line Width**: 80 characters
- **Line Ending**: LF
- **Quotes**: Double quotes for JS/TS, JSX
- **Semicolons**: Always required
- **Trailing Commas**: ES5 style
- **Bracket Spacing**: Enabled
- **Arrow Parentheses**: Always

## TypeScript Rules
- **Strict mode**: Enabled
- **Unused locals/parameters**: Not allowed
- **Fallthrough cases**: Not allowed
- **Side effect imports**: Must be checked

## Architecture Patterns
- **Feature-based structure**: Following bulletproof-react patterns
- **Path aliases**: Use `@/` for src imports
- **Pure functions**: No side effects for game logic
- **Test coverage**: 90% threshold for game features, 80% global

## Naming Conventions
- **Files**: kebab-case for components, camelCase for utilities
- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase

## Git Commit Format
- "Issue #[number]: [specific change description]"