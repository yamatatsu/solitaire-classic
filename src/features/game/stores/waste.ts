import { atom } from "jotai";
import type { Card } from "../types";

// Initialize empty waste pile
const initialWaste: Card[] = [];

// Base waste atom - ensures all cards are face-up
export const wasteAtom = atom<Card[]>(
  initialWaste,
  (get, set, newValue: Card[]) => {
    // Ensure all cards in waste are face-up
    const faceUpCards = newValue.map((card) => ({ ...card, faceUp: true }));
    set(wasteAtom, faceUpCards);
  }
);

// Action to add card(s) to waste pile
export const addCardToWaste = atom(
  null,
  (get, set, { card, cards }: { card?: Card; cards?: Card[] }) => {
    const currentWaste = get(wasteAtom);

    if (card) {
      // Add single card (ensure face-up)
      const faceUpCard = { ...card, faceUp: true };
      set(wasteAtom, [...currentWaste, faceUpCard]);
    } else if (cards) {
      // Add multiple cards (ensure all face-up)
      const faceUpCards = cards.map((c) => ({ ...c, faceUp: true }));
      set(wasteAtom, [...currentWaste, ...faceUpCards]);
    }
  }
);

// Action to remove card(s) from waste pile
export const removeCardFromWaste = atom(
  null,
  (
    get,
    set,
    { cardId, count = 1 }: { cardId?: string; count?: number } = {}
  ) => {
    const currentWaste = get(wasteAtom);

    if (currentWaste.length === 0) {
      throw new Error("Cannot remove cards from empty waste pile");
    }

    if (cardId) {
      // Remove specific card by ID
      const cardIndex = currentWaste.findIndex((card) => card.id === cardId);
      if (cardIndex === -1) {
        throw new Error(`Card with id ${cardId} not found in waste pile`);
      }

      const newWaste = currentWaste.filter((card) => card.id !== cardId);
      set(wasteAtom, newWaste);
    } else {
      // Remove from top (end of array)
      if (count > currentWaste.length) {
        throw new Error(
          `Cannot remove ${count} cards from waste pile with only ${currentWaste.length} cards`
        );
      }

      const newWaste = currentWaste.slice(0, -count);
      set(wasteAtom, newWaste);
    }
  }
);

// Action to clear waste pile
export const clearWaste = atom(
  null,
  (get, set, { cards }: { cards?: Card[] } = {}) => {
    if (cards) {
      // Reset with new cards (ensure all face-up)
      const faceUpCards = cards.map((card) => ({ ...card, faceUp: true }));
      set(wasteAtom, faceUpCards);
    } else {
      // Clear completely
      set(wasteAtom, []);
    }
  }
);
