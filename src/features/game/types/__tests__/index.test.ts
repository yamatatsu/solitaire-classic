import { describe, it, expect } from 'vitest';
import type { Card, GameState, MoveAction, Suit, Rank } from '../index';
import {
  isValidSuit,
  isValidRank,
  isValidCard,
  isCard,
  isSuit,
  isRank,
  isGameState,
  isMoveAction,
  validateCard,
  validateGameState,
  validateMoveAction,
  SUITS,
  RANKS,
  MOVE_TYPES
} from '../index';

describe('Game Types', () => {
  describe('Card interface', () => {
    it('should have correct structure for a card', () => {
      const card: Card = {
        suit: 'hearts',
        rank: 1,
        faceUp: true,
        id: 'hearts-1',
      };

      expect(card).toHaveProperty('suit');
      expect(card).toHaveProperty('rank');
      expect(card).toHaveProperty('faceUp');
      expect(card).toHaveProperty('id');
      expect(typeof card.suit).toBe('string');
      expect(typeof card.rank).toBe('number');
      expect(typeof card.faceUp).toBe('boolean');
      expect(typeof card.id).toBe('string');
    });

    it('should accept valid suit values', () => {
      const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

      suits.forEach(suit => {
        const card: Card = {
          suit,
          rank: 1,
          faceUp: true,
          id: `${suit}-1`,
        };
        expect(card.suit).toBe(suit);
      });
    });

    it('should accept valid rank values', () => {
      const ranks: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

      ranks.forEach(rank => {
        const card: Card = {
          suit: 'hearts',
          rank,
          faceUp: true,
          id: `hearts-${rank}`,
        };
        expect(card.rank).toBe(rank);
      });
    });
  });

  describe('GameState interface', () => {
    it('should have correct structure for game state', () => {
      const gameState: GameState = {
        tableau: Array(7).fill([]),
        foundations: Array(4).fill([]),
        stock: [],
        waste: [],
      };

      expect(gameState).toHaveProperty('tableau');
      expect(gameState).toHaveProperty('foundations');
      expect(gameState).toHaveProperty('stock');
      expect(gameState).toHaveProperty('waste');
      expect(Array.isArray(gameState.tableau)).toBe(true);
      expect(Array.isArray(gameState.foundations)).toBe(true);
      expect(Array.isArray(gameState.stock)).toBe(true);
      expect(Array.isArray(gameState.waste)).toBe(true);
    });

    it('should allow tableau with 7 columns', () => {
      const gameState: GameState = {
        tableau: Array(7).fill([]),
        foundations: Array(4).fill([]),
        stock: [],
        waste: [],
      };

      expect(gameState.tableau).toHaveLength(7);
    });

    it('should allow foundations with 4 piles', () => {
      const gameState: GameState = {
        tableau: Array(7).fill([]),
        foundations: Array(4).fill([]),
        stock: [],
        waste: [],
      };

      expect(gameState.foundations).toHaveLength(4);
    });
  });

  describe('MoveAction interface', () => {
    it('should support MOVE_CARD action', () => {
      const moveAction: MoveAction = {
        type: 'MOVE_CARD',
        payload: {
          from: 'tableau-0',
          to: 'foundation-0',
          cardId: 'hearts-1',
        },
      };

      expect(moveAction.type).toBe('MOVE_CARD');
      expect(moveAction.payload).toHaveProperty('from');
      expect(moveAction.payload).toHaveProperty('to');
      expect(moveAction.payload).toHaveProperty('cardId');
    });

    it('should support FLIP_CARD action', () => {
      const flipAction: MoveAction = {
        type: 'FLIP_CARD',
        payload: {
          cardId: 'hearts-1',
        },
      };

      expect(flipAction.type).toBe('FLIP_CARD');
      expect(flipAction.payload).toHaveProperty('cardId');
    });

    it('should support DEAL_CARD action', () => {
      const dealAction: MoveAction = {
        type: 'DEAL_CARD',
        payload: {},
      };

      expect(dealAction.type).toBe('DEAL_CARD');
      expect(dealAction.payload).toBeDefined();
    });

    it('should support RESET_STOCK action', () => {
      const resetAction: MoveAction = {
        type: 'RESET_STOCK',
        payload: {},
      };

      expect(resetAction.type).toBe('RESET_STOCK');
      expect(resetAction.payload).toBeDefined();
    });
  });

  describe('Validation Functions', () => {
    describe('isValidSuit', () => {
      it('should return true for valid suits', () => {
        expect(isValidSuit('hearts')).toBe(true);
        expect(isValidSuit('diamonds')).toBe(true);
        expect(isValidSuit('clubs')).toBe(true);
        expect(isValidSuit('spades')).toBe(true);
      });

      it('should return false for invalid suits', () => {
        expect(isValidSuit('invalid')).toBe(false);
        expect(isValidSuit('')).toBe(false);
        expect(isValidSuit('HEARTS')).toBe(false);
        expect(isValidSuit('heart')).toBe(false);
        expect(isValidSuit(null)).toBe(false);
        expect(isValidSuit(undefined)).toBe(false);
        expect(isValidSuit(123)).toBe(false);
      });
    });

    describe('isValidRank', () => {
      it('should return true for valid ranks', () => {
        for (let i = 1; i <= 13; i++) {
          expect(isValidRank(i)).toBe(true);
        }
      });

      it('should return false for invalid ranks', () => {
        expect(isValidRank(0)).toBe(false);
        expect(isValidRank(14)).toBe(false);
        expect(isValidRank(-1)).toBe(false);
        expect(isValidRank(1.5)).toBe(false);
        expect(isValidRank('1')).toBe(false);
        expect(isValidRank(null)).toBe(false);
        expect(isValidRank(undefined)).toBe(false);
        expect(isValidRank(NaN)).toBe(false);
        expect(isValidRank(Infinity)).toBe(false);
      });
    });

    describe('isValidCard', () => {
      it('should return true for valid card objects', () => {
        const validCard = {
          suit: 'hearts' as Suit,
          rank: 1 as Rank,
          faceUp: true,
          id: 'hearts-1'
        };
        expect(isValidCard(validCard)).toBe(true);

        const anotherValidCard = {
          suit: 'spades' as Suit,
          rank: 13 as Rank,
          faceUp: false,
          id: 'spades-13'
        };
        expect(isValidCard(anotherValidCard)).toBe(true);
      });

      it('should return false for invalid card objects', () => {
        expect(isValidCard(null)).toBe(false);
        expect(isValidCard(undefined)).toBe(false);
        expect(isValidCard({})).toBe(false);
        expect(isValidCard('card')).toBe(false);

        // Missing properties
        expect(isValidCard({ suit: 'hearts' })).toBe(false);
        expect(isValidCard({ suit: 'hearts', rank: 1 })).toBe(false);
        expect(isValidCard({ suit: 'hearts', rank: 1, faceUp: true })).toBe(false);

        // Invalid property types
        expect(isValidCard({
          suit: 'invalid',
          rank: 1,
          faceUp: true,
          id: 'test'
        })).toBe(false);

        expect(isValidCard({
          suit: 'hearts',
          rank: 0,
          faceUp: true,
          id: 'test'
        })).toBe(false);

        expect(isValidCard({
          suit: 'hearts',
          rank: 1,
          faceUp: 'true',
          id: 'test'
        })).toBe(false);

        expect(isValidCard({
          suit: 'hearts',
          rank: 1,
          faceUp: true,
          id: 123
        })).toBe(false);
      });
    });
  });

  describe('Type Guards', () => {
    describe('isSuit', () => {
      it('should return true for valid suit values', () => {
        expect(isSuit('hearts')).toBe(true);
        expect(isSuit('diamonds')).toBe(true);
        expect(isSuit('clubs')).toBe(true);
        expect(isSuit('spades')).toBe(true);
      });

      it('should return false for invalid values', () => {
        expect(isSuit('invalid')).toBe(false);
        expect(isSuit('')).toBe(false);
        expect(isSuit(null)).toBe(false);
        expect(isSuit(undefined)).toBe(false);
        expect(isSuit(123)).toBe(false);
        expect(isSuit({})).toBe(false);
      });

      it('should narrow type correctly', () => {
        const value: unknown = 'hearts';
        if (isSuit(value)) {
          // TypeScript should know this is a Suit
          expect(value).toBe('hearts');
          const suit: Suit = value; // This should not cause a type error
          expect(suit).toBe('hearts');
        }
      });
    });

    describe('isRank', () => {
      it('should return true for valid rank values', () => {
        for (let i = 1; i <= 13; i++) {
          expect(isRank(i)).toBe(true);
        }
      });

      it('should return false for invalid values', () => {
        expect(isRank(0)).toBe(false);
        expect(isRank(14)).toBe(false);
        expect(isRank('1')).toBe(false);
        expect(isRank(null)).toBe(false);
        expect(isRank(undefined)).toBe(false);
        expect(isRank(1.5)).toBe(false);
        expect(isRank(NaN)).toBe(false);
      });

      it('should narrow type correctly', () => {
        const value: unknown = 1;
        if (isRank(value)) {
          // TypeScript should know this is a Rank
          expect(value).toBe(1);
          const rank: Rank = value; // This should not cause a type error
          expect(rank).toBe(1);
        }
      });
    });

    describe('isCard', () => {
      it('should return true for valid Card objects', () => {
        const card = {
          suit: 'hearts' as Suit,
          rank: 1 as Rank,
          faceUp: true,
          id: 'hearts-1'
        };
        expect(isCard(card)).toBe(true);
      });

      it('should return false for invalid objects', () => {
        expect(isCard(null)).toBe(false);
        expect(isCard(undefined)).toBe(false);
        expect(isCard({})).toBe(false);
        expect(isCard('card')).toBe(false);
        expect(isCard(123)).toBe(false);
      });

      it('should narrow type correctly', () => {
        const value: unknown = {
          suit: 'hearts',
          rank: 1,
          faceUp: true,
          id: 'hearts-1'
        };
        if (isCard(value)) {
          // TypeScript should know this is a Card
          expect(value.suit).toBe('hearts');
          const card: Card = value; // This should not cause a type error
          expect(card.suit).toBe('hearts');
        }
      });
    });

    describe('isGameState', () => {
      it('should return true for valid GameState objects', () => {
        const gameState = {
          tableau: Array(7).fill([]),
          foundations: Array(4).fill([]),
          stock: [],
          waste: []
        };
        expect(isGameState(gameState)).toBe(true);
      });

      it('should return false for invalid objects', () => {
        expect(isGameState(null)).toBe(false);
        expect(isGameState(undefined)).toBe(false);
        expect(isGameState({})).toBe(false);
        expect(isGameState('gamestate')).toBe(false);

        // Missing properties
        expect(isGameState({
          tableau: [],
          foundations: [],
          stock: []
          // missing waste
        })).toBe(false);

        // Wrong types
        expect(isGameState({
          tableau: 'not-array',
          foundations: [],
          stock: [],
          waste: []
        })).toBe(false);
      });
    });

    describe('isMoveAction', () => {
      it('should return true for valid MoveAction objects', () => {
        const moveAction = {
          type: 'MOVE_CARD' as const,
          payload: {
            from: 'tableau-0',
            to: 'foundation-0',
            cardId: 'hearts-1'
          }
        };
        expect(isMoveAction(moveAction)).toBe(true);
      });

      it('should return false for invalid objects', () => {
        expect(isMoveAction(null)).toBe(false);
        expect(isMoveAction(undefined)).toBe(false);
        expect(isMoveAction({})).toBe(false);
        expect(isMoveAction('action')).toBe(false);

        // Invalid type
        expect(isMoveAction({
          type: 'INVALID_ACTION',
          payload: {}
        })).toBe(false);

        // Missing payload
        expect(isMoveAction({
          type: 'MOVE_CARD'
        })).toBe(false);
      });
    });
  });

  describe('Validation with Error Messages', () => {
    describe('validateCard', () => {
      it('should return valid result for valid card', () => {
        const card = {
          suit: 'hearts' as Suit,
          rank: 1 as Rank,
          faceUp: true,
          id: 'hearts-1'
        };
        const result = validateCard(card);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should return invalid result with error messages for invalid card', () => {
        const invalidCard = {
          suit: 'invalid',
          rank: 0,
          faceUp: 'true',
          id: 123
        };
        const result = validateCard(invalidCard);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors).toContain('Invalid suit: invalid');
        expect(result.errors).toContain('Invalid rank: 0');
        expect(result.errors).toContain('faceUp must be a boolean');
        expect(result.errors).toContain('id must be a string');
      });

      it('should handle null and undefined inputs', () => {
        expect(validateCard(null).isValid).toBe(false);
        expect(validateCard(undefined).isValid).toBe(false);
        expect(validateCard(null).errors).toContain('Card must be an object');
        expect(validateCard(undefined).errors).toContain('Card must be an object');
      });
    });

    describe('validateGameState', () => {
      it('should return valid result for valid game state', () => {
        const gameState = {
          tableau: Array(7).fill([]),
          foundations: Array(4).fill([]),
          stock: [],
          waste: []
        };
        const result = validateGameState(gameState);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should return invalid result with error messages for invalid game state', () => {
        const invalidGameState = {
          tableau: 'not-array',
          foundations: null,
          stock: undefined
          // missing waste
        };
        const result = validateGameState(invalidGameState);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    describe('validateMoveAction', () => {
      it('should return valid result for valid move action', () => {
        const moveAction = {
          type: 'MOVE_CARD' as const,
          payload: {
            from: 'tableau-0',
            to: 'foundation-0',
            cardId: 'hearts-1'
          }
        };
        const result = validateMoveAction(moveAction);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should return invalid result with error messages for invalid move action', () => {
        const invalidMoveAction = {
          type: 'INVALID_ACTION',
          payload: 'not-object'
        };
        const result = validateMoveAction(invalidMoveAction);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases and Additional Validation', () => {
    describe('SUITS and RANKS constants', () => {
      it('should have correct SUITS constant values', () => {
        expect(SUITS).toEqual(['hearts', 'diamonds', 'clubs', 'spades']);
        expect(SUITS).toHaveLength(4);
      });

      it('should have correct RANKS constant values', () => {
        expect(RANKS).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
        expect(RANKS).toHaveLength(13);
      });

      it('should have correct MOVE_TYPES constant values', () => {
        expect(MOVE_TYPES).toEqual(['MOVE_CARD', 'FLIP_CARD', 'DEAL_CARD', 'RESET_STOCK']);
        expect(MOVE_TYPES).toHaveLength(4);
      });
    });

    describe('Edge cases for type guards', () => {
      it('should handle weird JavaScript values correctly', () => {
        // Testing with various falsy values
        expect(isSuit(0)).toBe(false);
        expect(isSuit(false)).toBe(false);
        expect(isSuit('')).toBe(false);
        expect(isSuit(NaN)).toBe(false);

        expect(isRank('')).toBe(false);
        expect(isRank(false)).toBe(false);
        expect(isRank(true)).toBe(false);
        expect(isRank([])).toBe(false);
        expect(isRank({})).toBe(false);
      });

      it('should handle prototype pollution attempts', () => {
        const maliciousObject = Object.create(null);
        maliciousObject.suit = 'hearts';
        maliciousObject.rank = 1;
        maliciousObject.faceUp = true;
        maliciousObject.id = 'test';

        expect(isCard(maliciousObject)).toBe(true); // Should still work
      });

      it('should handle circular references safely', () => {
        const circular: any = { suit: 'hearts', rank: 1, faceUp: true, id: 'test' };
        circular.self = circular;

        expect(isCard(circular)).toBe(true); // Should work despite circular reference
      });

      it('should handle arrays masquerading as objects', () => {
        const arrayWithProperties = ['hearts', 1, true, 'test'];
        (arrayWithProperties as any).suit = 'hearts';
        (arrayWithProperties as any).rank = 1;
        (arrayWithProperties as any).faceUp = true;
        (arrayWithProperties as any).id = 'test';

        expect(isCard(arrayWithProperties)).toBe(true); // Arrays are objects in JS
      });

      it('should handle number edge cases for ranks', () => {
        expect(isRank(1.0)).toBe(true); // 1.0 is integer
        expect(isRank(1.1)).toBe(false); // 1.1 is not integer
        expect(isRank(Number.MAX_SAFE_INTEGER)).toBe(false); // Too large
        expect(isRank(Number.MIN_SAFE_INTEGER)).toBe(false); // Too small
        expect(isRank(-0)).toBe(false); // Negative zero
        expect(isRank(+0)).toBe(false); // Positive zero
      });

      it('should handle string edge cases for suits', () => {
        expect(isSuit('Hearts')).toBe(false); // Wrong case
        expect(isSuit(' hearts ')).toBe(false); // Extra whitespace
        expect(isSuit('hearts\0')).toBe(false); // Null terminator
        expect(isSuit('hearts\n')).toBe(false); // Newline
      });
    });

    describe('GameState validation edge cases', () => {
      it('should handle complex invalid GameState objects', () => {
        const invalidGameState = {
          tableau: [1, 2, 3], // should be array of arrays
          foundations: 'not-array',
          stock: null,
          waste: [],
          extraProperty: 'should be ignored'
        };

        const result = validateGameState(invalidGameState);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('foundations must be an array');
        expect(result.errors).toContain('stock must be an array');
      });

      it('should validate proper nested array structure', () => {
        const validGameState = {
          tableau: [[], [], [], [], [], [], []], // 7 empty arrays
          foundations: [[], [], [], []], // 4 empty arrays
          stock: [],
          waste: []
        };

        expect(isGameState(validGameState)).toBe(true);
      });
    });

    describe('Comprehensive validation result testing', () => {
      it('should provide detailed error messages for completely invalid card', () => {
        const invalidCard = {
          suit: 123,
          rank: 'invalid',
          faceUp: null,
          id: []
        };

        const result = validateCard(invalidCard);
        expect(result.isValid).toBe(false);
        expect(result.errors).toHaveLength(4);
        expect(result.errors).toContain('Invalid suit: 123');
        expect(result.errors).toContain('Invalid rank: invalid');
        expect(result.errors).toContain('faceUp must be a boolean');
        expect(result.errors).toContain('id must be a string');
      });

      it('should handle missing properties in card validation', () => {
        const incompleteCard = {
          suit: 'hearts'
          // missing rank, faceUp, id
        };

        const result = validateCard(incompleteCard);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });
});