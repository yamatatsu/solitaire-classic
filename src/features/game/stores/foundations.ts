import { atom } from "jotai";
import type { Card } from "../types";

// Initialize empty 4-foundation piles (one for each suit)
const initialFoundations: Card[][] = Array.from({ length: 4 }, () => []);

// Base foundations atom
export const foundationsAtom = atom<Card[][]>(initialFoundations);

// Action to add a card to a specific foundation
export const addCardToFoundation = atom(
  null,
  (
    get,
    set,
    { foundationIndex, card }: { foundationIndex: number; card: Card }
  ) => {
    if (foundationIndex < 0 || foundationIndex >= 4) {
      throw new Error(`Invalid foundation index: ${foundationIndex}`);
    }

    if (!card.faceUp) {
      throw new Error("Only face-up cards can be added to foundations");
    }

    const currentFoundations = get(foundationsAtom);
    const foundation = currentFoundations[foundationIndex];

    if (foundation.length === 0) {
      // Empty foundation - only accept Aces
      if (card.rank !== 1) {
        throw new Error("Only Aces can be placed on empty foundations");
      }
    } else {
      // Foundation has cards - validate suit and rank sequence
      const topCard = foundation[foundation.length - 1];

      if (card.suit !== topCard.suit) {
        throw new Error("Card must be same suit as foundation");
      }

      if (card.rank !== topCard.rank + 1) {
        throw new Error("Card rank must be exactly one higher than top card");
      }
    }

    const newFoundations = currentFoundations.map((foundationPile, index) => {
      if (index === foundationIndex) {
        return [...foundationPile, card];
      }
      return foundationPile;
    });

    set(foundationsAtom, newFoundations);
  }
);

// Action to remove a card from a specific foundation (remove top card)
export const removeCardFromFoundation = atom(
  null,
  (get, set, { foundationIndex }: { foundationIndex: number }) => {
    if (foundationIndex < 0 || foundationIndex >= 4) {
      throw new Error(`Invalid foundation index: ${foundationIndex}`);
    }

    const currentFoundations = get(foundationsAtom);
    const foundation = currentFoundations[foundationIndex];

    if (foundation.length === 0) {
      throw new Error("Cannot remove card from empty foundation");
    }

    const newFoundations = currentFoundations.map((foundationPile, index) => {
      if (index === foundationIndex) {
        return foundationPile.slice(0, -1);
      }
      return foundationPile;
    });

    set(foundationsAtom, newFoundations);
  }
);
