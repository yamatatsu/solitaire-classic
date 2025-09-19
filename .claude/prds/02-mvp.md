---
name: 02-mvp
description: Minimum viable product for Klondike solitaire game with basic functionality and shadcn UI setup
status: completed
created: 2025-09-19T06:19:37Z
completed: 2025-09-19T14:09:40Z
---

# PRD: 02-mvp

## Executive Summary

Build a minimum viable product (MVP) for a Klondike solitaire game that allows players to complete a full game using basic interactions. The MVP prioritizes core functionality over visual polish, focusing on game completion as the primary success metric. Includes shadcn UI library setup as the foundation for future enhancements.

## Problem Statement

Casual mobile gamers need a simple, accessible way to play classic solitaire without the complexity of advanced features or elaborate animations. Current solitaire options often overwhelm users with unnecessary features when they just want to play a quick, straightforward game.

**Why now:** Establishing a solid technical foundation with core gameplay mechanics enables rapid iteration and feature additions in subsequent releases.

## User Stories

### Primary Persona: Casual Mobile Gamer
- Age: 25-55
- Device: Primarily mobile (smartphone/tablet)
- Goal: Quick, simple entertainment during breaks
- Pain point: Complicated interfaces and unnecessary features

### User Journeys

**Primary Journey: Complete a Game**
1. User opens the website on mobile browser
2. Game automatically deals cards in standard Klondike layout
3. User plays by dragging cards and clicking stock pile
4. User moves all cards to foundation piles
5. System displays "Finish" message

**Secondary Journey: Start New Game**
1. User wants to play again
2. User clicks "New Game" button
3. Cards are re-dealt for fresh game

## Requirements

### Functional Requirements

**Core Game Setup**
- Automatically deal 52-card deck in Klondike layout on page load
- Display 7 tableau columns (1, 2, 3, 4, 5, 6, 7 cards respectively)
- Show 4 foundation piles (Hearts, Diamonds, Clubs, Spades)
- Display stock pile and waste pile

**Game Interactions**
- Drag cards between tableau columns (following Klondike rules)
- Drag cards from tableau/waste pile to foundation piles
- Click stock pile to flip cards to waste pile (draw 3 cards)
- Support unlimited redeal when stock pile is empty

**Game State Management**
- Validate all moves according to Klondike rules
- Track game completion state
- Display "Finish" message when all cards moved to foundations

**UI Components**
- "New Game" button for restarting
- Basic card representations showing suit and rank
- Clear visual distinction between face-up and face-down cards

**Technical Foundation**
- Setup shadcn UI library as first implementation step
- Use shadcn components for buttons and basic UI elements

### Non-Functional Requirements

**Performance**
- Page load time < 3 seconds on mobile networks
- Smooth drag interactions without lag

**Compatibility**
- Modern browsers only (Chrome 90+, Safari 14+, Firefox 88+)
- Responsive design for mobile screens (320px - 768px)

**Usability**
- Touch-friendly drag targets (minimum 44px touch areas)
- Clear visual feedback for valid drop zones

## Success Criteria

**Primary Metric**
- At least one game completion is technically possible and verifiable

**Secondary Metrics**
- Game loads successfully on target browsers
- All core interactions function correctly
- Responsive layout works on mobile devices

## Constraints & Assumptions

**Technical Constraints**
- Web browser platform only
- No backend/server requirements
- Static deployment suitable

**Scope Constraints**
- No scoring system
- No timer functionality
- No game statistics
- No auto-move features (double-click)
- No save/resume functionality
- No animations or transitions
- No win/lose detection beyond completion

**Assumptions**
- Users understand basic Klondike solitaire rules
- Modern mobile browsers have adequate drag/drop support
- Basic card representations are sufficient for gameplay

## Out of Scope

**Explicitly NOT Building**
- Double-click auto-move to foundations
- Scoring system
- Timer functionality
- Game statistics or history
- Save/resume game state
- Win/unwinnable game detection
- Hint system
- Undo functionality
- Sound effects
- Animations or visual effects
- User accounts or authentication
- Multiplayer features

## Dependencies

**External Dependencies**
- shadcn UI library setup and configuration
- Modern browser drag/drop APIs
- CSS flexbox/grid support

**Internal Dependencies**
- None (this is the foundational MVP)

**Risk Mitigation**
- Test drag/drop functionality across target mobile browsers early
- Validate shadcn setup process before core game development
- Ensure card layout responsiveness on various screen sizes

## Implementation Priority

**Phase 1: Foundation**
1. Setup shadcn UI library
2. Create basic project structure
3. Implement card data models

**Phase 2: Core Gameplay**
1. Implement card dealing logic
2. Build tableau and foundation layouts
3. Add drag/drop interactions
4. Implement Klondike rule validation

**Phase 3: Game Flow**
1. Add stock pile click functionality
2. Implement win condition detection
3. Add "New Game" functionality
4. Final testing and validation

## Acceptance Criteria

- [ ] shadcn UI is properly configured and functional
- [ ] Cards deal correctly in Klondike layout
- [ ] All drag/drop interactions work on mobile
- [ ] Stock pile click draws 3 cards correctly
- [ ] Game detects completion and shows "Finish"
- [ ] "New Game" button resets game state
- [ ] Responsive design works on 320px-768px screens
- [ ] At least one complete game playthrough is possible