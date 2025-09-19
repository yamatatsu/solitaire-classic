import { createStore } from "jotai";
import { beforeEach, describe, expect, it } from "vitest";
import type { Card } from "../../types";
import {
  addCardToTableauColumn,
  flipCardInTableau,
  removeCardFromTableauColumn,
  tableauAtom,
} from "../tableau";

// Helper function to create test cards
const createCard = (
  suit: Card["suit"],
  rank: Card["rank"],
  faceUp = false,
  id?: string
): Card => ({
  suit,
  rank,
  faceUp,
  id: id || `${suit}-${rank}`,
});

describe("Tableau Atom", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe("Initial State", () => {
    it("should initialize with empty 7-column tableau", () => {
      const tableau = store.get(tableauAtom);

      expect(tableau).toHaveLength(7);
      expect(
        tableau.every(
          (column: Card[]) => Array.isArray(column) && column.length === 0
        )
      ).toBe(true);
    });
  });

  describe("State Updates", () => {
    it("should update tableau state directly", () => {
      const testTableau = [
        [createCard("hearts", 1, true)],
        [],
        [],
        [],
        [],
        [],
        [],
      ];

      store.set(tableauAtom, testTableau);
      const tableau = store.get(tableauAtom);

      expect(tableau[0]).toHaveLength(1);
      expect(tableau[0][0]).toEqual(createCard("hearts", 1, true));
    });

    it("should preserve immutability when setting new state", () => {
      const originalTableau = [
        [createCard("hearts", 1, true)],
        [],
        [],
        [],
        [],
        [],
        [],
      ];

      store.set(tableauAtom, originalTableau);
      const firstTableau = store.get(tableauAtom);

      // Set new state
      const newTableau = [
        [createCard("hearts", 1, true), createCard("clubs", 2, true)],
        [],
        [],
        [],
        [],
        [],
        [],
      ];

      store.set(tableauAtom, newTableau);
      const secondTableau = store.get(tableauAtom);

      expect(secondTableau).not.toBe(firstTableau);
      expect(secondTableau[0]).toHaveLength(2);
    });
  });

  describe("Add Card to Column Action", () => {
    it("should add a card to specified column", () => {
      const card = createCard("hearts", 1, true);

      store.set(addCardToTableauColumn, { columnIndex: 0, card });
      const tableau = store.get(tableauAtom);

      expect(tableau[0]).toHaveLength(1);
      expect(tableau[0][0]).toEqual(card);
    });

    it("should add multiple cards to the same column", () => {
      const card1 = createCard("hearts", 1, true);
      const card2 = createCard("clubs", 2, true);

      store.set(addCardToTableauColumn, { columnIndex: 0, card: card1 });
      store.set(addCardToTableauColumn, { columnIndex: 0, card: card2 });
      const tableau = store.get(tableauAtom);

      expect(tableau[0]).toHaveLength(2);
      expect(tableau[0][0]).toEqual(card1);
      expect(tableau[0][1]).toEqual(card2);
    });

    it("should throw error for invalid column index", () => {
      const card = createCard("hearts", 1, true);

      expect(() => {
        store.set(addCardToTableauColumn, { columnIndex: 7, card });
      }).toThrow("Invalid column index: 7");

      expect(() => {
        store.set(addCardToTableauColumn, { columnIndex: -1, card });
      }).toThrow("Invalid column index: -1");
    });

    it("should not modify other columns when adding to one column", () => {
      const initialTableau = [
        [createCard("hearts", 1, true)],
        [createCard("diamonds", 2, true)],
        [],
        [],
        [],
        [],
        [],
      ];

      store.set(tableauAtom, initialTableau);

      // Add card to column 2
      const newCard = createCard("clubs", 3, true);
      store.set(addCardToTableauColumn, { columnIndex: 2, card: newCard });
      const tableau = store.get(tableauAtom);

      expect(tableau[0]).toHaveLength(1);
      expect(tableau[1]).toHaveLength(1);
      expect(tableau[2]).toHaveLength(1);
      expect(tableau[2][0]).toEqual(newCard);
    });
  });

  describe("Remove Card from Column Action", () => {
    it("should remove a card from specified column", () => {
      const card1 = createCard("hearts", 1, true);
      const card2 = createCard("clubs", 2, true);
      const initialTableau = [[card1, card2], [], [], [], [], [], []];

      store.set(tableauAtom, initialTableau);
      store.set(removeCardFromTableauColumn, {
        columnIndex: 0,
        cardId: card2.id,
      });
      const tableau = store.get(tableauAtom);

      expect(tableau[0]).toHaveLength(1);
      expect(tableau[0][0]).toEqual(card1);
    });

    it("should remove the last card when no cardId is provided", () => {
      const card1 = createCard("hearts", 1, true);
      const card2 = createCard("clubs", 2, true);
      const initialTableau = [[card1, card2], [], [], [], [], [], []];

      store.set(tableauAtom, initialTableau);
      store.set(removeCardFromTableauColumn, { columnIndex: 0 });
      const tableau = store.get(tableauAtom);

      expect(tableau[0]).toHaveLength(1);
      expect(tableau[0][0]).toEqual(card1);
    });

    it("should throw error for invalid column index", () => {
      expect(() => {
        store.set(removeCardFromTableauColumn, {
          columnIndex: 7,
          cardId: "test",
        });
      }).toThrow("Invalid column index: 7");

      expect(() => {
        store.set(removeCardFromTableauColumn, { columnIndex: -1 });
      }).toThrow("Invalid column index: -1");
    });

    it("should throw error when trying to remove from empty column", () => {
      expect(() => {
        store.set(removeCardFromTableauColumn, { columnIndex: 0 });
      }).toThrow("Cannot remove card from empty column");
    });

    it("should throw error when card not found", () => {
      const card = createCard("hearts", 1, true);
      const initialTableau = [[card], [], [], [], [], [], []];

      store.set(tableauAtom, initialTableau);

      expect(() => {
        store.set(removeCardFromTableauColumn, {
          columnIndex: 0,
          cardId: "non-existent",
        });
      }).toThrow("Card with id non-existent not found in column 0");
    });
  });

  describe("Flip Card Action", () => {
    it("should flip a card from face down to face up", () => {
      const card = createCard("hearts", 1, false, "test-card");
      const initialTableau = [[card], [], [], [], [], [], []];

      store.set(tableauAtom, initialTableau);
      store.set(flipCardInTableau, { columnIndex: 0, cardId: "test-card" });
      const tableau = store.get(tableauAtom);

      expect(tableau[0][0].faceUp).toBe(true);
    });

    it("should flip a card from face up to face down", () => {
      const card = createCard("hearts", 1, true, "test-card");
      const initialTableau = [[card], [], [], [], [], [], []];

      store.set(tableauAtom, initialTableau);
      store.set(flipCardInTableau, { columnIndex: 0, cardId: "test-card" });
      const tableau = store.get(tableauAtom);

      expect(tableau[0][0].faceUp).toBe(false);
    });

    it("should throw error for invalid column index", () => {
      expect(() => {
        store.set(flipCardInTableau, { columnIndex: 7, cardId: "test" });
      }).toThrow("Invalid column index: 7");
    });

    it("should throw error when card not found", () => {
      const card = createCard("hearts", 1, true);
      const initialTableau = [[card], [], [], [], [], [], []];

      store.set(tableauAtom, initialTableau);

      expect(() => {
        store.set(flipCardInTableau, {
          columnIndex: 0,
          cardId: "non-existent",
        });
      }).toThrow("Card with id non-existent not found in column 0");
    });
  });

  describe("State Validation", () => {
    it("should validate tableau structure", () => {
      const tableau = store.get(tableauAtom);

      // Test that tableau maintains 7 columns
      expect(tableau).toHaveLength(7);
      expect(tableau.every((column: any) => Array.isArray(column))).toBe(true);
    });

    it("should handle complex tableau state", () => {
      const complexTableau = [
        [createCard("hearts", 1, false), createCard("clubs", 2, true)],
        [createCard("diamonds", 3, false)],
        [],
        [
          createCard("spades", 4, true),
          createCard("hearts", 5, false),
          createCard("clubs", 6, true),
        ],
        [],
        [createCard("diamonds", 7, false)],
        [],
      ];

      store.set(tableauAtom, complexTableau);
      const tableau = store.get(tableauAtom);

      expect(tableau[0]).toHaveLength(2);
      expect(tableau[1]).toHaveLength(1);
      expect(tableau[2]).toHaveLength(0);
      expect(tableau[3]).toHaveLength(3);
      expect(tableau[4]).toHaveLength(0);
      expect(tableau[5]).toHaveLength(1);
      expect(tableau[6]).toHaveLength(0);
    });
  });
});
