# Essential Development Commands

## Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## Code Quality
- `pnpm biome:check` - Check and auto-fix code issues
- `pnpm lint` - Run linter only
- `pnpm format` - Format code

## Testing
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:ui` - Open Vitest UI
- `pnpm test:game` - Run only game feature tests

## Git Workflow
- `git add .` - Stage changes
- `git commit -m "message"` - Commit changes (triggers husky hooks)
- `git push` - Push to remote

## System Commands (macOS)
- `ls -la` - List files with details
- `find . -name "*.ts"` - Find TypeScript files
- `grep -r "pattern" src/` - Search in source files