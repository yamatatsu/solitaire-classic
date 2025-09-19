import { createStore } from "jotai";
import { beforeEach, describe, expect, it } from "vitest";
import type { Card } from "../../types";
import {
  addCardToFoundation,
  foundationsAtom,
  removeCardFromFoundation,
} from "../foundations";

// Helper function to create test cards
const createCard = (
  suit: Card["suit"],
  rank: Card["rank"],
  faceUp = true,
  id?: string
): Card => ({
  suit,
  rank,
  faceUp,
  id: id || `${suit}-${rank}`,
});

describe("Foundations Atom", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe("Initial State", () => {
    it("should initialize with empty 4-foundation piles", () => {
      const foundations = store.get(foundationsAtom);

      expect(foundations).toHaveLength(4);
      expect(
        foundations.every(
          (foundation: Card[]) =>
            Array.isArray(foundation) && foundation.length === 0
        )
      ).toBe(true);
    });
  });

  describe("State Updates", () => {
    it("should update foundations state directly", () => {
      const testFoundations = [[createCard("hearts", 1)], [], [], []];

      store.set(foundationsAtom, testFoundations);
      const foundations = store.get(foundationsAtom);

      expect(foundations[0]).toHaveLength(1);
      expect(foundations[0][0]).toEqual(createCard("hearts", 1));
    });

    it("should preserve immutability when setting new state", () => {
      const originalFoundations = [[createCard("hearts", 1)], [], [], []];

      store.set(foundationsAtom, originalFoundations);
      const firstFoundations = store.get(foundationsAtom);

      // Set new state
      const newFoundations = [
        [createCard("hearts", 1), createCard("hearts", 2)],
        [],
        [],
        [],
      ];

      store.set(foundationsAtom, newFoundations);
      const secondFoundations = store.get(foundationsAtom);

      expect(secondFoundations).not.toBe(firstFoundations);
      expect(secondFoundations[0]).toHaveLength(2);
    });
  });

  describe("Add Card to Foundation Action", () => {
    it("should add an Ace to empty foundation", () => {
      const ace = createCard("hearts", 1);

      store.set(addCardToFoundation, { foundationIndex: 0, card: ace });
      const foundations = store.get(foundationsAtom);

      expect(foundations[0]).toHaveLength(1);
      expect(foundations[0][0]).toEqual(ace);
    });

    it("should add cards in sequence (Ace, 2, 3, etc.)", () => {
      const ace = createCard("hearts", 1);
      const two = createCard("hearts", 2);
      const three = createCard("hearts", 3);

      store.set(addCardToFoundation, { foundationIndex: 0, card: ace });
      store.set(addCardToFoundation, { foundationIndex: 0, card: two });
      store.set(addCardToFoundation, { foundationIndex: 0, card: three });

      const foundations = store.get(foundationsAtom);

      expect(foundations[0]).toHaveLength(3);
      expect(foundations[0][0]).toEqual(ace);
      expect(foundations[0][1]).toEqual(two);
      expect(foundations[0][2]).toEqual(three);
    });

    it("should reject non-Ace card on empty foundation", () => {
      const two = createCard("hearts", 2);

      expect(() => {
        store.set(addCardToFoundation, { foundationIndex: 0, card: two });
      }).toThrow("Only Aces can be placed on empty foundations");
    });

    it("should reject card with wrong suit", () => {
      const aceHearts = createCard("hearts", 1);
      const twoSpades = createCard("spades", 2);

      store.set(addCardToFoundation, { foundationIndex: 0, card: aceHearts });

      expect(() => {
        store.set(addCardToFoundation, { foundationIndex: 0, card: twoSpades });
      }).toThrow("Card must be same suit as foundation");
    });

    it("should reject card with wrong rank sequence", () => {
      const ace = createCard("hearts", 1);
      const three = createCard("hearts", 3);

      store.set(addCardToFoundation, { foundationIndex: 0, card: ace });

      expect(() => {
        store.set(addCardToFoundation, { foundationIndex: 0, card: three });
      }).toThrow("Card rank must be exactly one higher than top card");
    });

    it("should reject face-down cards", () => {
      const faceDownAce = createCard("hearts", 1, false);

      expect(() => {
        store.set(addCardToFoundation, {
          foundationIndex: 0,
          card: faceDownAce,
        });
      }).toThrow("Only face-up cards can be added to foundations");
    });

    it("should throw error for invalid foundation index", () => {
      const ace = createCard("hearts", 1);

      expect(() => {
        store.set(addCardToFoundation, { foundationIndex: 4, card: ace });
      }).toThrow("Invalid foundation index: 4");

      expect(() => {
        store.set(addCardToFoundation, { foundationIndex: -1, card: ace });
      }).toThrow("Invalid foundation index: -1");
    });

    it("should not modify other foundations when adding to one", () => {
      const aceHearts = createCard("hearts", 1);
      const aceSpades = createCard("spades", 1);

      // Set up initial state with cards in foundations
      const initialFoundations = [[aceHearts], [], [aceSpades], []];

      store.set(foundationsAtom, initialFoundations);

      // Add card to foundation 1
      const aceClubs = createCard("clubs", 1);
      store.set(addCardToFoundation, { foundationIndex: 1, card: aceClubs });

      const foundations = store.get(foundationsAtom);

      expect(foundations[0]).toHaveLength(1);
      expect(foundations[0][0]).toEqual(aceHearts);
      expect(foundations[1]).toHaveLength(1);
      expect(foundations[1][0]).toEqual(aceClubs);
      expect(foundations[2]).toHaveLength(1);
      expect(foundations[2][0]).toEqual(aceSpades);
      expect(foundations[3]).toHaveLength(0);
    });

    it("should allow building complete suit from Ace to King", () => {
      const cards: Card[] = [];

      // Create all hearts from Ace to King
      for (let rank = 1; rank <= 13; rank++) {
        cards.push(createCard("hearts", rank as Card["rank"]));
      }

      // Add all cards in sequence
      for (const card of cards) {
        store.set(addCardToFoundation, { foundationIndex: 0, card });
      }

      const foundations = store.get(foundationsAtom);

      expect(foundations[0]).toHaveLength(13);
      expect(foundations[0][0].rank).toBe(1); // Ace
      expect(foundations[0][12].rank).toBe(13); // King
    });
  });

  describe("Remove Card from Foundation Action", () => {
    it("should remove the top card from foundation", () => {
      const ace = createCard("hearts", 1);
      const two = createCard("hearts", 2);
      const initialFoundations = [[ace, two], [], [], []];

      store.set(foundationsAtom, initialFoundations);
      store.set(removeCardFromFoundation, { foundationIndex: 0 });

      const foundations = store.get(foundationsAtom);

      expect(foundations[0]).toHaveLength(1);
      expect(foundations[0][0]).toEqual(ace);
    });

    it("should throw error when trying to remove from empty foundation", () => {
      expect(() => {
        store.set(removeCardFromFoundation, { foundationIndex: 0 });
      }).toThrow("Cannot remove card from empty foundation");
    });

    it("should throw error for invalid foundation index", () => {
      expect(() => {
        store.set(removeCardFromFoundation, { foundationIndex: 4 });
      }).toThrow("Invalid foundation index: 4");

      expect(() => {
        store.set(removeCardFromFoundation, { foundationIndex: -1 });
      }).toThrow("Invalid foundation index: -1");
    });

    it("should not modify other foundations when removing from one", () => {
      const aceHearts = createCard("hearts", 1);
      const twoHearts = createCard("hearts", 2);
      const aceSpades = createCard("spades", 1);

      const initialFoundations = [[aceHearts, twoHearts], [], [aceSpades], []];

      store.set(foundationsAtom, initialFoundations);
      store.set(removeCardFromFoundation, { foundationIndex: 0 });

      const foundations = store.get(foundationsAtom);

      expect(foundations[0]).toHaveLength(1);
      expect(foundations[0][0]).toEqual(aceHearts);
      expect(foundations[1]).toHaveLength(0);
      expect(foundations[2]).toHaveLength(1);
      expect(foundations[2][0]).toEqual(aceSpades);
      expect(foundations[3]).toHaveLength(0);
    });
  });

  describe("State Validation", () => {
    it("should validate foundations structure", () => {
      const foundations = store.get(foundationsAtom);

      // Test that foundations maintains 4 piles
      expect(foundations).toHaveLength(4);
      expect(
        foundations.every((foundation: any) => Array.isArray(foundation))
      ).toBe(true);
    });

    it("should handle complex foundations state", () => {
      const complexFoundations = [
        [
          createCard("hearts", 1),
          createCard("hearts", 2),
          createCard("hearts", 3),
        ],
        [createCard("diamonds", 1)],
        [],
        [createCard("clubs", 1), createCard("clubs", 2)],
      ];

      store.set(foundationsAtom, complexFoundations);
      const foundations = store.get(foundationsAtom);

      expect(foundations[0]).toHaveLength(3);
      expect(foundations[1]).toHaveLength(1);
      expect(foundations[2]).toHaveLength(0);
      expect(foundations[3]).toHaveLength(2);
    });

    it("should maintain proper suit sequences in foundations", () => {
      const heartsSequence = [
        createCard("hearts", 1),
        createCard("hearts", 2),
        createCard("hearts", 3),
        createCard("hearts", 4),
      ];

      const foundationsWithSequence = [heartsSequence, [], [], []];

      store.set(foundationsAtom, foundationsWithSequence);
      const foundations = store.get(foundationsAtom);

      // Verify sequence integrity
      expect(foundations[0][0].suit).toBe("hearts");
      expect(foundations[0][0].rank).toBe(1);
      expect(foundations[0][3].suit).toBe("hearts");
      expect(foundations[0][3].rank).toBe(4);

      // All cards should be same suit
      expect(foundations[0].every((card: Card) => card.suit === "hearts")).toBe(
        true
      );

      // Ranks should be sequential
      for (let i = 0; i < foundations[0].length; i++) {
        expect(foundations[0][i].rank).toBe(i + 1);
      }
    });
  });
});
