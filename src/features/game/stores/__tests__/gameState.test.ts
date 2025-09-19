import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from 'jotai';
import type { Card, GameState } from '../../types';
import { gameStateAtom, resetGameState, isGameWon } from '../gameState';
import { tableauAtom } from '../tableau';
import { foundationsAtom } from '../foundations';
import { stockAtom } from '../stock';
import { wasteAtom } from '../waste';

// Helper function to create test cards
const createCard = (suit: Card['suit'], rank: Card['rank'], faceUp = true, id?: string): Card => ({
  suit,
  rank,
  faceUp,
  id: id || `${suit}-${rank}`
});

describe('Game State Atom', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe('Derived Game State', () => {
    it('should create game state from individual atoms', () => {
      const testTableau = [
        [createCard('hearts', 1)],
        [],
        [],
        [],
        [],
        [],
        []
      ];
      const testFoundations = [
        [createCard('spades', 1)],
        [],
        [],
        []
      ];
      const testStock = [createCard('clubs', 2), createCard('diamonds', 3)];
      const testWaste = [createCard('hearts', 4)];

      store.set(tableauAtom, testTableau);
      store.set(foundationsAtom, testFoundations);
      store.set(stockAtom, testStock);
      store.set(wasteAtom, testWaste);

      const gameState = store.get(gameStateAtom);

      expect(gameState.tableau).toEqual(testTableau);
      expect(gameState.foundations).toEqual(testFoundations);
      expect(gameState.stock).toEqual(testStock);
      expect(gameState.waste).toEqual(testWaste);
    });

    it('should reflect changes in individual atoms', () => {
      // Initial state
      const gameState1 = store.get(gameStateAtom);
      expect(gameState1.tableau.every(col => col.length === 0)).toBe(true);

      // Update tableau
      const newTableau = [
        [createCard('hearts', 1), createCard('clubs', 2)],
        [],
        [],
        [],
        [],
        [],
        []
      ];
      store.set(tableauAtom, newTableau);

      const gameState2 = store.get(gameStateAtom);
      expect(gameState2.tableau[0]).toHaveLength(2);
      expect(gameState2.tableau[0][0]).toEqual(createCard('hearts', 1));
    });

    it('should maintain immutability of derived state', () => {
      const gameState1 = store.get(gameStateAtom);

      // Modify tableau
      store.set(tableauAtom, [
        [createCard('hearts', 1)],
        [],
        [],
        [],
        [],
        [],
        []
      ]);

      const gameState2 = store.get(gameStateAtom);

      expect(gameState2).not.toBe(gameState1);
      expect(gameState2.tableau).not.toBe(gameState1.tableau);
    });

    it('should preserve GameState interface structure', () => {
      const gameState = store.get(gameStateAtom);

      expect(gameState).toHaveProperty('tableau');
      expect(gameState).toHaveProperty('foundations');
      expect(gameState).toHaveProperty('stock');
      expect(gameState).toHaveProperty('waste');

      expect(Array.isArray(gameState.tableau)).toBe(true);
      expect(Array.isArray(gameState.foundations)).toBe(true);
      expect(Array.isArray(gameState.stock)).toBe(true);
      expect(Array.isArray(gameState.waste)).toBe(true);

      expect(gameState.tableau).toHaveLength(7);
      expect(gameState.foundations).toHaveLength(4);
    });
  });

  describe('Reset Game State Action', () => {
    it('should reset all atoms to initial state', () => {
      // Set up some game state
      store.set(tableauAtom, [
        [createCard('hearts', 1)],
        [],
        [],
        [],
        [],
        [],
        []
      ]);
      store.set(foundationsAtom, [
        [createCard('spades', 1)],
        [],
        [],
        []
      ]);
      store.set(stockAtom, [createCard('clubs', 2)]);
      store.set(wasteAtom, [createCard('diamonds', 3)]);

      // Reset
      store.set(resetGameState, {});

      const gameState = store.get(gameStateAtom);

      expect(gameState.tableau.every(col => col.length === 0)).toBe(true);
      expect(gameState.foundations.every(foundation => foundation.length === 0)).toBe(true);
      expect(gameState.stock).toEqual([]);
      expect(gameState.waste).toEqual([]);
    });

    it('should reset to specific game state if provided', () => {
      const specificState: GameState = {
        tableau: [
          [createCard('hearts', 1), createCard('clubs', 2)],
          [createCard('diamonds', 3)],
          [],
          [],
          [],
          [],
          []
        ],
        foundations: [
          [createCard('spades', 1)],
          [],
          [],
          []
        ],
        stock: [createCard('hearts', 4), createCard('clubs', 5)],
        waste: [createCard('diamonds', 6)]
      };

      store.set(resetGameState, { gameState: specificState });

      const gameState = store.get(gameStateAtom);

      expect(gameState.tableau[0]).toHaveLength(2);
      expect(gameState.tableau[1]).toHaveLength(1);
      expect(gameState.foundations[0]).toHaveLength(1);
      expect(gameState.stock).toHaveLength(2);
      expect(gameState.waste).toHaveLength(1);
    });

    it('should validate provided game state structure', () => {
      const invalidState = {
        tableau: [[], [], []], // Wrong number of columns
        foundations: [[], []], // Wrong number of foundations
        stock: [],
        waste: []
      } as any;

      expect(() => {
        store.set(resetGameState, { gameState: invalidState });
      }).toThrow('Invalid game state: tableau must have exactly 7 columns');
    });

    it('should validate foundations structure', () => {
      const invalidState = {
        tableau: Array.from({ length: 7 }, () => []),
        foundations: [[], [], []], // Wrong number of foundations
        stock: [],
        waste: []
      } as any;

      expect(() => {
        store.set(resetGameState, { gameState: invalidState });
      }).toThrow('Invalid game state: foundations must have exactly 4 piles');
    });
  });

  describe('Game Won Detection', () => {
    it('should return false for initial empty game state', () => {
      const isWon = store.get(isGameWon);
      expect(isWon).toBe(false);
    });

    it('should return false when foundations are not complete', () => {
      // Set up partial foundations
      store.set(foundationsAtom, [
        [createCard('hearts', 1), createCard('hearts', 2)],
        [createCard('diamonds', 1)],
        [],
        []
      ]);

      const isWon = store.get(isGameWon);
      expect(isWon).toBe(false);
    });

    it('should return true when all foundations are complete (Ace to King)', () => {
      // Create complete foundations for all suits
      const completeFoundations: Card[][] = [];
      const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];

      for (const suit of suits) {
        const suitPile: Card[] = [];
        for (let rank = 1; rank <= 13; rank++) {
          suitPile.push(createCard(suit, rank as Card['rank']));
        }
        completeFoundations.push(suitPile);
      }

      store.set(foundationsAtom, completeFoundations);

      const isWon = store.get(isGameWon);
      expect(isWon).toBe(true);
    });

    it('should return false if one foundation is incomplete', () => {
      // Create foundations with one incomplete pile
      const foundations: Card[][] = [];
      const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];

      for (let i = 0; i < suits.length; i++) {
        const suit = suits[i];
        const suitPile: Card[] = [];
        const maxRank = i === 3 ? 12 : 13; // Last suit incomplete

        for (let rank = 1; rank <= maxRank; rank++) {
          suitPile.push(createCard(suit, rank as Card['rank']));
        }
        foundations.push(suitPile);
      }

      store.set(foundationsAtom, foundations);

      const isWon = store.get(isGameWon);
      expect(isWon).toBe(false);
    });

    it('should check foundation sequences correctly', () => {
      // Create foundations with wrong sequence (missing card in middle)
      const foundations: Card[][] = [
        [createCard('hearts', 1), createCard('hearts', 3)], // Missing 2
        [],
        [],
        []
      ];

      store.set(foundationsAtom, foundations);

      const isWon = store.get(isGameWon);
      expect(isWon).toBe(false);
    });

    it('should update win status when foundations change', () => {
      // Start with incomplete game
      let isWon = store.get(isGameWon);
      expect(isWon).toBe(false);

      // Complete all foundations
      const completeFoundations: Card[][] = [];
      const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];

      for (const suit of suits) {
        const suitPile: Card[] = [];
        for (let rank = 1; rank <= 13; rank++) {
          suitPile.push(createCard(suit, rank as Card['rank']));
        }
        completeFoundations.push(suitPile);
      }

      store.set(foundationsAtom, completeFoundations);

      isWon = store.get(isGameWon);
      expect(isWon).toBe(true);
    });
  });

  describe('State Consistency', () => {
    it('should maintain consistency between individual atoms and derived state', () => {
      const tableau = [
        [createCard('hearts', 1)],
        [createCard('clubs', 2)],
        [],
        [],
        [],
        [],
        []
      ];
      const foundations = [
        [createCard('spades', 1)],
        [],
        [],
        []
      ];
      const stock = [createCard('diamonds', 3)];
      const waste = [createCard('hearts', 4)];

      store.set(tableauAtom, tableau);
      store.set(foundationsAtom, foundations);
      store.set(stockAtom, stock);
      store.set(wasteAtom, waste);

      const gameState = store.get(gameStateAtom);

      // Check direct atom access matches derived state
      expect(store.get(tableauAtom)).toEqual(gameState.tableau);
      expect(store.get(foundationsAtom)).toEqual(gameState.foundations);
      expect(store.get(stockAtom)).toEqual(gameState.stock);
      expect(store.get(wasteAtom)).toEqual(gameState.waste);
    });

    it('should handle complex game state updates', () => {
      // Simulate a complex game state
      const complexTableau = [
        [createCard('hearts', 1, false), createCard('clubs', 2, true)],
        [createCard('diamonds', 3, false), createCard('spades', 4, true), createCard('hearts', 5, true)],
        [],
        [createCard('clubs', 6, false)],
        [],
        [createCard('spades', 7, false), createCard('diamonds', 8, true)],
        [createCard('hearts', 9, false)]
      ];

      const complexFoundations = [
        [createCard('hearts', 1), createCard('hearts', 2)],
        [createCard('diamonds', 1)],
        [],
        [createCard('spades', 1), createCard('spades', 2), createCard('spades', 3)]
      ];

      const complexStock = [
        createCard('clubs', 10, false),
        createCard('diamonds', 11, false),
        createCard('hearts', 12, false)
      ];

      const complexWaste = [
        createCard('spades', 10, true),
        createCard('clubs', 11, true)
      ];

      store.set(tableauAtom, complexTableau);
      store.set(foundationsAtom, complexFoundations);
      store.set(stockAtom, complexStock);
      store.set(wasteAtom, complexWaste);

      const gameState = store.get(gameStateAtom);

      expect(gameState.tableau[0]).toHaveLength(2);
      expect(gameState.tableau[1]).toHaveLength(3);
      expect(gameState.foundations[0]).toHaveLength(2);
      expect(gameState.foundations[3]).toHaveLength(3);
      expect(gameState.stock).toHaveLength(3);
      expect(gameState.waste).toHaveLength(2);
    });
  });
});