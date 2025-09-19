import { describe, it, expect } from 'vitest';
import type { Card, GameState, MoveAction, Suit, Rank } from '../index';

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
});