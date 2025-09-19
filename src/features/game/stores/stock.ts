import { atom } from 'jotai';
import type { Card } from '../types';

// Initialize empty stock pile
const initialStock: Card[] = [];

// Base stock atom
export const stockAtom = atom<Card[]>(initialStock);

// Action to add card(s) to stock
export const addCardToStock = atom(
  null,
  (get, set, payload: { card?: Card; cards?: Card[]; faceDown?: boolean }) => {
    const currentStock = get(stockAtom);

    if (payload.card) {
      // Add single card
      let cardToAdd: Card;

      if (payload.faceDown === true) {
        cardToAdd = { ...payload.card, faceUp: false };
      } else if (payload.faceDown === false) {
        cardToAdd = { ...payload.card, faceUp: true };
      } else {
        cardToAdd = payload.card;
      }

      set(stockAtom, [...currentStock, cardToAdd]);
    } else if (payload.cards) {
      // Add multiple cards
      let cardsToAdd: Card[];

      if (payload.faceDown === true) {
        cardsToAdd = payload.cards.map(card => ({ ...card, faceUp: false }));
      } else if (payload.faceDown === false) {
        cardsToAdd = payload.cards.map(card => ({ ...card, faceUp: true }));
      } else {
        cardsToAdd = payload.cards;
      }

      set(stockAtom, [...currentStock, ...cardsToAdd]);
    }
  }
);

// Action to remove card(s) from top of stock
export const removeCardFromStock = atom(
  null,
  (get, set, { count = 1 }: { count?: number }) => {
    const currentStock = get(stockAtom);

    if (currentStock.length === 0) {
      throw new Error('Cannot remove cards from empty stock');
    }

    if (count > currentStock.length) {
      throw new Error(`Cannot remove ${count} cards from stock with only ${currentStock.length} cards`);
    }

    // Remove from the end (top of stack)
    const newStock = currentStock.slice(0, -count);
    set(stockAtom, newStock);
  }
);

// Action to deal cards from stock (similar to remove but with different semantics)
export const dealCardsFromStock = atom(
  null,
  (get, set, { count = 1 }: { count?: number }) => {
    const currentStock = get(stockAtom);

    if (currentStock.length === 0) {
      throw new Error('Cannot deal cards from empty stock');
    }

    if (count > currentStock.length) {
      throw new Error(`Cannot deal ${count} cards from stock with only ${currentStock.length} cards`);
    }

    // Deal from the end (top of stack)
    const newStock = currentStock.slice(0, -count);
    set(stockAtom, newStock);
  }
);

// Action to reset stock pile
export const resetStock = atom(
  null,
  (get, set, { cards, faceDown }: { cards?: Card[]; faceDown?: boolean } = {}) => {
    if (cards) {
      // Reset with new cards
      let resetCards: Card[];

      if (faceDown === true) {
        // Force all cards face down
        resetCards = cards.map(card => ({ ...card, faceUp: false }));
      } else if (faceDown === false) {
        // Preserve original card orientation
        resetCards = cards;
      } else {
        // No faceDown specified, preserve original cards
        resetCards = cards;
      }

      set(stockAtom, resetCards);
    } else {
      // Clear stock completely
      set(stockAtom, []);
    }
  }
);