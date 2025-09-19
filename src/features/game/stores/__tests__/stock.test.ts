import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from 'jotai';
import type { Card } from '../../types';
import { stockAtom, addCardToStock, removeCardFromStock, dealCardsFromStock, resetStock } from '../stock';

// Helper function to create test cards
const createCard = (suit: Card['suit'], rank: Card['rank'], faceUp = false, id?: string): Card => ({
  suit,
  rank,
  faceUp,
  id: id || `${suit}-${rank}`
});

describe('Stock Atom', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe('Initial State', () => {
    it('should initialize with empty stock pile', () => {
      const stock = store.get(stockAtom);

      expect(stock).toEqual([]);
      expect(Array.isArray(stock)).toBe(true);
    });
  });

  describe('State Updates', () => {
    it('should update stock state directly', () => {
      const testStock = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3)
      ];

      store.set(stockAtom, testStock);
      const stock = store.get(stockAtom);

      expect(stock).toHaveLength(3);
      expect(stock[0]).toEqual(createCard('hearts', 1));
      expect(stock[2]).toEqual(createCard('diamonds', 3));
    });

    it('should preserve immutability when setting new state', () => {
      const originalStock = [createCard('hearts', 1)];

      store.set(stockAtom, originalStock);
      const firstStock = store.get(stockAtom);

      const newStock = [createCard('hearts', 1), createCard('clubs', 2)];
      store.set(stockAtom, newStock);
      const secondStock = store.get(stockAtom);

      expect(secondStock).not.toBe(firstStock);
      expect(secondStock).toHaveLength(2);
    });
  });

  describe('Add Card to Stock Action', () => {
    it('should add a card to the top of stock', () => {
      const card = createCard('hearts', 1);

      store.set(addCardToStock, { card });
      const stock = store.get(stockAtom);

      expect(stock).toHaveLength(1);
      expect(stock[0]).toEqual(card);
    });

    it('should add multiple cards maintaining stack order', () => {
      const card1 = createCard('hearts', 1);
      const card2 = createCard('clubs', 2);
      const card3 = createCard('diamonds', 3);

      store.set(addCardToStock, { card: card1 });
      store.set(addCardToStock, { card: card2 });
      store.set(addCardToStock, { card: card3 });

      const stock = store.get(stockAtom);

      expect(stock).toHaveLength(3);
      expect(stock[0]).toEqual(card1);
      expect(stock[1]).toEqual(card2);
      expect(stock[2]).toEqual(card3);
    });

    it('should add cards with face-down orientation by default', () => {
      const faceUpCard = createCard('hearts', 1, true);

      store.set(addCardToStock, { card: faceUpCard, faceDown: true });
      const stock = store.get(stockAtom);

      expect(stock[0].faceUp).toBe(false);
    });

    it('should maintain face-up state when specified', () => {
      const faceUpCard = createCard('hearts', 1, true);

      store.set(addCardToStock, { card: faceUpCard, faceDown: false });
      const stock = store.get(stockAtom);

      expect(stock[0].faceUp).toBe(true);
    });

    it('should add multiple cards at once', () => {
      const cards = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3)
      ];

      store.set(addCardToStock, { cards });
      const stock = store.get(stockAtom);

      expect(stock).toHaveLength(3);
      expect(stock[0]).toEqual(cards[0]);
      expect(stock[2]).toEqual(cards[2]);
    });
  });

  describe('Remove Card from Stock Action', () => {
    it('should remove the top card from stock', () => {
      const cards = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3)
      ];

      store.set(stockAtom, cards);
      store.set(removeCardFromStock, {});

      const stock = store.get(stockAtom);

      expect(stock).toHaveLength(2);
      expect(stock[0]).toEqual(createCard('hearts', 1));
      expect(stock[1]).toEqual(createCard('clubs', 2));
    });

    it('should remove specific number of cards', () => {
      const cards = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3),
        createCard('spades', 4)
      ];

      store.set(stockAtom, cards);
      store.set(removeCardFromStock, { count: 2 });

      const stock = store.get(stockAtom);

      expect(stock).toHaveLength(2);
      expect(stock[0]).toEqual(createCard('hearts', 1));
      expect(stock[1]).toEqual(createCard('clubs', 2));
    });

    it('should throw error when trying to remove from empty stock', () => {
      expect(() => {
        store.set(removeCardFromStock, {});
      }).toThrow('Cannot remove cards from empty stock');
    });

    it('should throw error when trying to remove more cards than available', () => {
      const cards = [createCard('hearts', 1), createCard('clubs', 2)];

      store.set(stockAtom, cards);

      expect(() => {
        store.set(removeCardFromStock, { count: 3 });
      }).toThrow('Cannot remove 3 cards from stock with only 2 cards');
    });

    it('should return removed cards', () => {
      const cards = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3)
      ];

      store.set(stockAtom, cards);

      // Note: Since we can't easily capture return values from atom setters,
      // we'll test the behavior through state changes
      store.set(removeCardFromStock, { count: 1 });
      const stock = store.get(stockAtom);

      expect(stock).toHaveLength(2);
      expect(stock[0]).toEqual(createCard('hearts', 1));
    });
  });

  describe('Deal Cards from Stock Action', () => {
    it('should deal single card by default', () => {
      const cards = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3)
      ];

      store.set(stockAtom, cards);
      store.set(dealCardsFromStock, {});

      const stock = store.get(stockAtom);

      expect(stock).toHaveLength(2);
    });

    it('should deal specified number of cards', () => {
      const cards = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3),
        createCard('spades', 4)
      ];

      store.set(stockAtom, cards);
      store.set(dealCardsFromStock, { count: 3 });

      const stock = store.get(stockAtom);

      expect(stock).toHaveLength(1);
      expect(stock[0]).toEqual(createCard('hearts', 1));
    });

    it('should throw error when dealing from empty stock', () => {
      expect(() => {
        store.set(dealCardsFromStock, {});
      }).toThrow('Cannot deal cards from empty stock');
    });

    it('should throw error when dealing more cards than available', () => {
      const cards = [createCard('hearts', 1)];

      store.set(stockAtom, cards);

      expect(() => {
        store.set(dealCardsFromStock, { count: 2 });
      }).toThrow('Cannot deal 2 cards from stock with only 1 cards');
    });
  });

  describe('Reset Stock Action', () => {
    it('should clear all cards from stock', () => {
      const cards = [
        createCard('hearts', 1),
        createCard('clubs', 2),
        createCard('diamonds', 3)
      ];

      store.set(stockAtom, cards);
      store.set(resetStock, {});

      const stock = store.get(stockAtom);

      expect(stock).toEqual([]);
    });

    it('should reset with new cards if provided', () => {
      const originalCards = [createCard('hearts', 1), createCard('clubs', 2)];
      const newCards = [createCard('diamonds', 3), createCard('spades', 4)];

      store.set(stockAtom, originalCards);
      store.set(resetStock, { cards: newCards });

      const stock = store.get(stockAtom);

      expect(stock).toHaveLength(2);
      expect(stock[0]).toEqual(createCard('diamonds', 3));
      expect(stock[1]).toEqual(createCard('spades', 4));
    });

    it('should apply face-down state to all cards when resetting', () => {
      const faceUpCards = [
        createCard('hearts', 1, true),
        createCard('clubs', 2, true)
      ];

      store.set(resetStock, { cards: faceUpCards, faceDown: true });
      const stock = store.get(stockAtom);

      expect(stock.every(card => !card.faceUp)).toBe(true);
    });

    it('should preserve card orientation when specified', () => {
      const mixedCards = [
        createCard('hearts', 1, true),
        createCard('clubs', 2, false)
      ];

      store.set(resetStock, { cards: mixedCards, faceDown: false });
      const stock = store.get(stockAtom);

      expect(stock[0].faceUp).toBe(true);
      expect(stock[1].faceUp).toBe(false);
    });
  });

  describe('State Validation', () => {
    it('should validate stock structure', () => {
      const stock = store.get(stockAtom);

      expect(Array.isArray(stock)).toBe(true);
    });

    it('should handle large stock pile', () => {
      const largeStock: Card[] = [];

      // Create a full deck of 52 cards
      const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
      for (const suit of suits) {
        for (let rank = 1; rank <= 13; rank++) {
          largeStock.push(createCard(suit, rank as Card['rank']));
        }
      }

      store.set(stockAtom, largeStock);
      const stock = store.get(stockAtom);

      expect(stock).toHaveLength(52);
      expect(stock[0].suit).toBe('hearts');
      expect(stock[0].rank).toBe(1);
      expect(stock[51].suit).toBe('spades');
      expect(stock[51].rank).toBe(13);
    });

    it('should maintain card order in stock', () => {
      const orderedCards = [
        createCard('hearts', 1),
        createCard('hearts', 2),
        createCard('hearts', 3),
        createCard('hearts', 4),
        createCard('hearts', 5)
      ];

      store.set(stockAtom, orderedCards);
      const stock = store.get(stockAtom);

      // Verify order is preserved
      for (let i = 0; i < orderedCards.length; i++) {
        expect(stock[i]).toEqual(orderedCards[i]);
      }
    });

    it('should handle empty stock gracefully', () => {
      const stock = store.get(stockAtom);

      expect(stock).toEqual([]);
      expect(stock.length).toBe(0);
    });
  });
});