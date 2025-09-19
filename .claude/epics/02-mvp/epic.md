---
name: 02-mvp
status: backlog
created: 2025-09-19T06:50:41Z
updated: 2025-09-19T08:01:36Z
progress: 0%
prd: .claude/prds/02-mvp.md
github: https://github.com/yamatatsu/solitaire-classic/issues/7
---

# Epic: 02-mvp

## Overview
Implement a minimal Klondike solitaire game using React with shadcn UI components. Focus on core game mechanics with drag/drop interactions, mobile-responsive design, and basic game state management without advanced features like scoring or animations.

## Architecture Decisions
- **UI Framework**: React with TypeScript for type safety and maintainability
- **Project Structure**: Bulletproof-react architecture with feature-based organization
- **UI Components**: shadcn/ui for consistent, accessible components
- **State Management**: Jotai for atomic state management with minimal boilerplate
- **Drag & Drop**: HTML5 Drag and Drop API with touch event fallbacks for mobile
- **Styling**: Tailwind CSS (via shadcn) for responsive design
- **Build Tool**: Vite (existing project setup)
- **Deployment**: Static site deployment (GitHub Pages compatible)

## Technical Approach

### Project Structure (Bulletproof-React)
```
src/
├── app/           # Application layer
├── assets/        # Static files (card suits, images)
├── components/    # Shared UI components
├── features/      # Feature-based modules
│   └── game/      # Solitaire game feature
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── stores/
│       ├── types/
│       └── utils/
├── hooks/         # Shared hooks
├── types/         # Shared TypeScript types
└── utils/         # Utility functions
```

### Frontend Components
- **Game Engine**: Pure functions in `features/game/utils/` for Klondike rules validation
- **Card Components**: Reusable components in `features/game/components/`
- **Game Areas**: Tableau, Foundation, Stock, and Waste pile components
- **Game State**: Jotai atoms in `features/game/stores/`
- **UI Controls**: Shared components using shadcn Button component

### Data Models
- **Card Types**: In `features/game/types/` - `{ suit: 'hearts' | 'diamonds' | 'clubs' | 'spades', rank: 1-13, faceUp: boolean }`
- **GameState Atoms**: In `features/game/stores/` - Separate Jotai atoms for `tableauAtom`, `foundationsAtom`, `stockAtom`, `wasteAtom`
- **Move Validation**: Pure functions in `features/game/utils/` to validate legal moves between game areas

### User Interaction Patterns
- **Drag Source**: Cards that can be moved (face-up tableau cards, waste pile top card)
- **Drop Targets**: Valid destinations (tableau columns, foundation piles)
- **Click Actions**: Stock pile click to draw cards
- **Touch Support**: Touch events for mobile drag/drop functionality

## Implementation Strategy

### Development Phases
1. **Foundation Setup**: shadcn installation and bulletproof-react project structure
2. **Game Engine (TDD)**: Test-driven development of card models, game state, and rule validation
3. **UI Implementation**: Card components and game layout
4. **Interaction Layer**: Drag/drop and click handlers
5. **Game Flow**: New game functionality and win detection

### Risk Mitigation
- **Mobile Drag/Drop**: Test early on target devices, implement touch fallbacks
- **Performance**: Use React.memo for card components to prevent unnecessary re-renders
- **Layout Responsiveness**: Test on 320px screens during development

### Testing Approach
- **Test-Driven Development**: Write tests first for all game engine functions before implementation
- **Unit Tests**: Comprehensive coverage of game logic (deal cards, validate moves, check win, Klondike rules)
- **Integration Tests**: Component interactions and game state updates
- **Manual Testing**: Cross-browser testing on mobile devices

## Task Breakdown Preview
High-level task categories (targeting ≤8 total tasks):
- [ ] **Setup**: Configure shadcn UI and project structure
- [ ] **Game Engine (TDD)**: Test-driven implementation of core Klondike logic and card models
- [ ] **Card Components**: Build reusable Card and game area components
- [ ] **Game Layout**: Create responsive mobile-first layout
- [ ] **Drag & Drop**: Implement card movement interactions
- [ ] **Stock Pile**: Add click-to-draw functionality
- [ ] **Game Controls**: New game button and win detection
- [ ] **Testing & Polish**: Cross-browser testing and final validation

## Dependencies

### External Dependencies
- shadcn/ui component library
- Tailwind CSS (included with shadcn)
- Jotai for state management
- React DnD or native HTML5 drag/drop APIs
- Touch event polyfills for mobile drag/drop
- Bulletproof-react project structure (no ESLint architectural constraints)

### Internal Dependencies
- None (foundational MVP)

### Critical Path
1. shadcn setup must complete before any UI development
2. Game engine tests must be written and passing before interaction layer
3. Mobile drag/drop testing throughout development

## Success Criteria (Technical)

### Performance Benchmarks
- Initial page load < 3 seconds on 3G mobile networks
- Drag interactions respond within 100ms
- No memory leaks during extended gameplay

### Quality Gates
- All game logic functions developed using TDD with 100% test coverage
- Cross-browser compatibility verified on Chrome 90+, Safari 14+, Firefox 88+
- Mobile responsiveness validated on 320px-768px screens
- Touch drag/drop functionality works on iOS and Android

### Acceptance Criteria
- Complete game can be played from deal to win
- All Klondike rules properly enforced
- "New Game" resets to playable state
- Win condition displays "Finish" message

## Estimated Effort

### Overall Timeline
- **Total Effort**: 5-7 development days
- **Critical Path**: 4 days (setup → game engine → interactions → testing)

### Resource Requirements
- 1 Frontend Developer with React/TypeScript experience
- Access to mobile devices for testing
- No backend or DevOps resources required

### Task Effort Distribution
- Setup & Foundation: 1 day
- Game Engine & Logic (TDD): 2.5 days (includes test writing)
- UI Components & Layout: 2 days
- Interactions & Controls: 1.5 days
- Testing & Validation: 0.5 day

## Tasks Created
- [ ] #8 - Setup shadcn UI and bulletproof-react project structure (parallel: false)
- [ ] #9 - Game feature structure and TDD setup (parallel: false)
- [ ] #10 - Game Engine TDD - Card models and types (parallel: false)
- [ ] #11 - Game Engine TDD - Game state atoms and stores (parallel: false)
- [ ] #12 - Game Engine TDD - Klondike rules validation (parallel: false)
- [ ] #13 - Card components and game areas (parallel: true)
- [ ] #14 - Drag and drop interactions with hooks (parallel: false)
- [ ] #15 - Game controls and application integration (parallel: false)

Total tasks: 8
Parallel tasks: 1
Sequential tasks: 7
Estimated total effort: 120 hours (15 days)
