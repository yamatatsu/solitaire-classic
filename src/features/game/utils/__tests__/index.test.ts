import { describe, it, expect } from 'vitest';
import { createCardId, isRedCard, isBlackCard, hasAlternatingColors } from '../index';
import type { Card } from '../../types';

describe('Game Utils', () => {
  describe('createCardId', () => {
    it('should create correct card ID for hearts', () => {
      const id = createCardId('hearts', 1);
      expect(id).toBe('hearts-1');
    });

    it('should create correct card ID for spades', () => {
      const id = createCardId('spades', 13);
      expect(id).toBe('spades-13');
    });

    it('should create correct card ID for diamonds', () => {
      const id = createCardId('diamonds', 7);
      expect(id).toBe('diamonds-7');
    });

    it('should create correct card ID for clubs', () => {
      const id = createCardId('clubs', 12);
      expect(id).toBe('clubs-12');
    });
  });

  describe('isRedCard', () => {
    it('should return true for hearts', () => {
      const card: Card = {
        suit: 'hearts',
        rank: 1,
        faceUp: true,
        id: 'hearts-1',
      };
      expect(isRedCard(card)).toBe(true);
    });

    it('should return true for diamonds', () => {
      const card: Card = {
        suit: 'diamonds',
        rank: 5,
        faceUp: true,
        id: 'diamonds-5',
      };
      expect(isRedCard(card)).toBe(true);
    });

    it('should return false for clubs', () => {
      const card: Card = {
        suit: 'clubs',
        rank: 10,
        faceUp: true,
        id: 'clubs-10',
      };
      expect(isRedCard(card)).toBe(false);
    });

    it('should return false for spades', () => {
      const card: Card = {
        suit: 'spades',
        rank: 13,
        faceUp: true,
        id: 'spades-13',
      };
      expect(isRedCard(card)).toBe(false);
    });
  });

  describe('isBlackCard', () => {
    it('should return true for clubs', () => {
      const card: Card = {
        suit: 'clubs',
        rank: 3,
        faceUp: true,
        id: 'clubs-3',
      };
      expect(isBlackCard(card)).toBe(true);
    });

    it('should return true for spades', () => {
      const card: Card = {
        suit: 'spades',
        rank: 8,
        faceUp: true,
        id: 'spades-8',
      };
      expect(isBlackCard(card)).toBe(true);
    });

    it('should return false for hearts', () => {
      const card: Card = {
        suit: 'hearts',
        rank: 6,
        faceUp: true,
        id: 'hearts-6',
      };
      expect(isBlackCard(card)).toBe(false);
    });

    it('should return false for diamonds', () => {
      const card: Card = {
        suit: 'diamonds',
        rank: 11,
        faceUp: true,
        id: 'diamonds-11',
      };
      expect(isBlackCard(card)).toBe(false);
    });
  });

  describe('hasAlternatingColors', () => {
    it('should return true for red card and black card', () => {
      const redCard: Card = {
        suit: 'hearts',
        rank: 7,
        faceUp: true,
        id: 'hearts-7',
      };
      const blackCard: Card = {
        suit: 'spades',
        rank: 8,
        faceUp: true,
        id: 'spades-8',
      };
      expect(hasAlternatingColors(redCard, blackCard)).toBe(true);
    });

    it('should return true for black card and red card', () => {
      const blackCard: Card = {
        suit: 'clubs',
        rank: 9,
        faceUp: true,
        id: 'clubs-9',
      };
      const redCard: Card = {
        suit: 'diamonds',
        rank: 8,
        faceUp: true,
        id: 'diamonds-8',
      };
      expect(hasAlternatingColors(blackCard, redCard)).toBe(true);
    });

    it('should return false for two red cards', () => {
      const redCard1: Card = {
        suit: 'hearts',
        rank: 5,
        faceUp: true,
        id: 'hearts-5',
      };
      const redCard2: Card = {
        suit: 'diamonds',
        rank: 4,
        faceUp: true,
        id: 'diamonds-4',
      };
      expect(hasAlternatingColors(redCard1, redCard2)).toBe(false);
    });

    it('should return false for two black cards', () => {
      const blackCard1: Card = {
        suit: 'clubs',
        rank: 2,
        faceUp: true,
        id: 'clubs-2',
      };
      const blackCard2: Card = {
        suit: 'spades',
        rank: 1,
        faceUp: true,
        id: 'spades-1',
      };
      expect(hasAlternatingColors(blackCard1, blackCard2)).toBe(false);
    });
  });
});