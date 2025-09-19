# Task Completion Checklist

## Before Committing
1. **Run Tests**: `pnpm test:run` - All tests must pass
2. **Check Coverage**: `pnpm test:coverage` - Meet coverage thresholds
3. **Code Quality**: `pnpm biome:check` - Fix all linting/formatting issues
4. **Build Check**: `pnpm build` - Ensure production build succeeds

## Coverage Thresholds
- **Global**: 80% (branches, functions, lines, statements)
- **Game Features**: 90% (branches, functions, lines, statements)

## TDD Workflow
1. Write failing test first
2. Implement minimal code to pass
3. Refactor while keeping tests green
4. Ensure 100% coverage for new functions

## Quality Gates
- No partial implementations
- No code duplication - reuse existing functions
- No dead code - remove unused code
- Pure functions for game logic
- Comprehensive error handling
- Edge case testing

## Commit Guidelines
- Use format: "Issue #12: [specific change]"
- Commit frequently with focused changes
- Each commit should be atomic and buildable