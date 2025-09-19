import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from 'jotai';
import type { Card } from '../../types';
import { wasteAtom, addCardToWaste, removeCardFromWaste, clearWaste } from '../waste';

// Helper function to create test cards
const createCard = (suit: Card['suit'], rank: Card['rank'], faceUp = true, id?: string): Card => ({
  suit,
  rank,
  faceUp,
  id: id || `${suit}-${rank}`
});

describe('Waste Atom', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe('Initial State', () => {
    it('should initialize with empty waste pile', () => {
      const waste = store.get(wasteAtom);

      expect(waste).toEqual([]);
      expect(Array.isArray(waste)).toBe(true);
    });
  });

  describe('State Updates', () => {
    it('should update waste state directly', () => {
      const testWaste = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3)
      ];

      store.set(wasteAtom, testWaste);
      const waste = store.get(wasteAtom);

      expect(waste).toHaveLength(3);
      expect(waste[0]).toEqual(createCard('hearts', 1));
      expect(waste[2]).toEqual(createCard('diamonds', 3));
    });

    it('should preserve immutability when setting new state', () => {
      const originalWaste = [createCard('hearts', 1)];

      store.set(wasteAtom, originalWaste);
      const firstWaste = store.get(wasteAtom);

      const newWaste = [createCard('hearts', 1), createCard('clubs', 2)];
      store.set(wasteAtom, newWaste);
      const secondWaste = store.get(wasteAtom);

      expect(secondWaste).not.toBe(firstWaste);
      expect(secondWaste).toHaveLength(2);
    });
  });

  describe('Add Card to Waste Action', () => {
    it('should add a card to the top of waste pile', () => {
      const card = createCard('hearts', 1);

      store.set(addCardToWaste, { card });
      const waste = store.get(wasteAtom);

      expect(waste).toHaveLength(1);
      expect(waste[0]).toEqual(card);
    });

    it('should add cards maintaining stack order (last added on top)', () => {
      const card1 = createCard('hearts', 1);
      const card2 = createCard('clubs', 2);
      const card3 = createCard('diamonds', 3);

      store.set(addCardToWaste, { card: card1 });
      store.set(addCardToWaste, { card: card2 });
      store.set(addCardToWaste, { card: card3 });

      const waste = store.get(wasteAtom);

      expect(waste).toHaveLength(3);
      expect(waste[0]).toEqual(card1); // First card added at bottom
      expect(waste[1]).toEqual(card2); // Second card in middle
      expect(waste[2]).toEqual(card3); // Last card added at top
    });

    it('should ensure cards are face-up when added to waste', () => {
      const faceDownCard = createCard('hearts', 1, false);

      store.set(addCardToWaste, { card: faceDownCard });
      const waste = store.get(wasteAtom);

      expect(waste[0].faceUp).toBe(true);
      expect(waste[0].suit).toBe(faceDownCard.suit);
      expect(waste[0].rank).toBe(faceDownCard.rank);
      expect(waste[0].id).toBe(faceDownCard.id);
    });

    it('should maintain face-up state for already face-up cards', () => {
      const faceUpCard = createCard('hearts', 1, true);

      store.set(addCardToWaste, { card: faceUpCard });
      const waste = store.get(wasteAtom);

      expect(waste[0].faceUp).toBe(true);
      expect(waste[0]).toEqual(faceUpCard);
    });

    it('should add multiple cards at once', () => {
      const cards = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3)
      ];

      store.set(addCardToWaste, { cards });
      const waste = store.get(wasteAtom);

      expect(waste).toHaveLength(3);
      expect(waste[0]).toEqual(cards[0]);
      expect(waste[2]).toEqual(cards[2]);
    });

    it('should ensure all cards are face-up when adding multiple cards', () => {
      const mixedCards = [
        createCard('hearts', 1, true),
        createCard('clubs', 2, false),
        createCard('diamonds', 3, false)
      ];

      store.set(addCardToWaste, { cards: mixedCards });
      const waste = store.get(wasteAtom);

      expect(waste.every(card => card.faceUp)).toBe(true);
      expect(waste).toHaveLength(3);
    });

    it('should preserve card properties except face orientation', () => {
      const card = createCard('spades', 10, false, 'special-id');

      store.set(addCardToWaste, { card });
      const waste = store.get(wasteAtom);

      expect(waste[0].suit).toBe('spades');
      expect(waste[0].rank).toBe(10);
      expect(waste[0].id).toBe('special-id');
      expect(waste[0].faceUp).toBe(true);
    });
  });

  describe('Remove Card from Waste Action', () => {
    it('should remove the top card from waste pile', () => {
      const cards = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3)
      ];

      store.set(wasteAtom, cards);
      store.set(removeCardFromWaste, {});

      const waste = store.get(wasteAtom);

      expect(waste).toHaveLength(2);
      expect(waste[0]).toEqual(createCard('hearts', 1));
      expect(waste[1]).toEqual(createCard('clubs', 2));
    });

    it('should remove specific card by id', () => {
      const card1 = createCard('hearts', 1, true, 'card-1');
      const card2 = createCard('clubs', 2, true, 'card-2');
      const card3 = createCard('diamonds', 3, true, 'card-3');

      store.set(wasteAtom, [card1, card2, card3]);
      store.set(removeCardFromWaste, { cardId: 'card-2' });

      const waste = store.get(wasteAtom);

      expect(waste).toHaveLength(2);
      expect(waste[0]).toEqual(card1);
      expect(waste[1]).toEqual(card3);
    });

    it('should remove multiple cards from top', () => {
      const cards = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3),
        createCard('spades', 4)
      ];

      store.set(wasteAtom, cards);
      store.set(removeCardFromWaste, { count: 2 });

      const waste = store.get(wasteAtom);

      expect(waste).toHaveLength(2);
      expect(waste[0]).toEqual(createCard('hearts', 1));
      expect(waste[1]).toEqual(createCard('clubs', 2));
    });

    it('should throw error when trying to remove from empty waste', () => {
      expect(() => {
        store.set(removeCardFromWaste, {});
      }).toThrow('Cannot remove cards from empty waste pile');
    });

    it('should throw error when trying to remove more cards than available', () => {
      const cards = [createCard('hearts', 1), createCard('clubs', 2)];

      store.set(wasteAtom, cards);

      expect(() => {
        store.set(removeCardFromWaste, { count: 3 });
      }).toThrow('Cannot remove 3 cards from waste pile with only 2 cards');
    });

    it('should throw error when card with specified id not found', () => {
      const card = createCard('hearts', 1, true, 'existing-card');

      store.set(wasteAtom, [card]);

      expect(() => {
        store.set(removeCardFromWaste, { cardId: 'non-existent' });
      }).toThrow('Card with id non-existent not found in waste pile');
    });

    it('should handle removing the only card in waste', () => {
      const card = createCard('hearts', 1);

      store.set(wasteAtom, [card]);
      store.set(removeCardFromWaste, {});

      const waste = store.get(wasteAtom);

      expect(waste).toEqual([]);
    });
  });

  describe('Clear Waste Action', () => {
    it('should clear all cards from waste pile', () => {
      const cards = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3)
      ];

      store.set(wasteAtom, cards);
      store.set(clearWaste, {});

      const waste = store.get(wasteAtom);

      expect(waste).toEqual([]);
    });

    it('should handle clearing already empty waste', () => {
      store.set(clearWaste, {});
      const waste = store.get(wasteAtom);

      expect(waste).toEqual([]);
    });

    it('should reset waste with new cards if provided', () => {
      const originalCards = [createCard('hearts', 1), createCard('clubs', 2)];
      const newCards = [createCard('diamonds', 3), createCard('spades', 4)];

      store.set(wasteAtom, originalCards);
      store.set(clearWaste, { cards: newCards });

      const waste = store.get(wasteAtom);

      expect(waste).toHaveLength(2);
      expect(waste[0]).toEqual(createCard('diamonds', 3));
      expect(waste[1]).toEqual(createCard('spades', 4));
    });

    it('should ensure all new cards are face-up when resetting', () => {
      const mixedCards = [
        createCard('hearts', 1, false),
        createCard('clubs', 2, true),
        createCard('diamonds', 3, false)
      ];

      store.set(clearWaste, { cards: mixedCards });
      const waste = store.get(wasteAtom);

      expect(waste.every(card => card.faceUp)).toBe(true);
      expect(waste).toHaveLength(3);
    });
  });

  describe('State Validation', () => {
    it('should validate waste structure', () => {
      const waste = store.get(wasteAtom);

      expect(Array.isArray(waste)).toBe(true);
    });

    it('should handle large waste pile', () => {
      const largeWaste: Card[] = [];

      // Create 26 cards (half a deck)
      const suits: Card['suit'][] = ['hearts', 'diamonds'];
      for (const suit of suits) {
        for (let rank = 1; rank <= 13; rank++) {
          largeWaste.push(createCard(suit, rank as Card['rank']));
        }
      }

      store.set(wasteAtom, largeWaste);
      const waste = store.get(wasteAtom);

      expect(waste).toHaveLength(26);
      expect(waste[0].suit).toBe('hearts');
      expect(waste[0].rank).toBe(1);
      expect(waste[25].suit).toBe('diamonds');
      expect(waste[25].rank).toBe(13);
    });

    it('should maintain card order in waste pile', () => {
      const orderedCards = [
        createCard('hearts', 1),
        createCard('hearts', 2),
        createCard('hearts', 3),
        createCard('hearts', 4),
        createCard('hearts', 5)
      ];

      store.set(wasteAtom, orderedCards);
      const waste = store.get(wasteAtom);

      // Verify order is preserved
      for (let i = 0; i < orderedCards.length; i++) {
        expect(waste[i]).toEqual(orderedCards[i]);
      }
    });

    it('should ensure all cards in waste are face-up', () => {
      const mixedCards = [
        createCard('hearts', 1, true),
        createCard('clubs', 2, false),
        createCard('diamonds', 3, true),
        createCard('spades', 4, false)
      ];

      store.set(wasteAtom, mixedCards);
      const waste = store.get(wasteAtom);

      // All waste cards should be face-up
      expect(waste.every(card => card.faceUp)).toBe(true);
    });

    it('should handle empty waste gracefully', () => {
      const waste = store.get(wasteAtom);

      expect(waste).toEqual([]);
      expect(waste.length).toBe(0);
    });

    it('should track top card correctly', () => {
      const cards = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3)
      ];

      store.set(wasteAtom, cards);
      const waste = store.get(wasteAtom);

      // Top card should be the last in the array
      const topCard = waste[waste.length - 1];
      expect(topCard).toEqual(createCard('diamonds', 3));
    });
  });
});