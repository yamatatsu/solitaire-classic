import { describe, expect, it } from "vitest";
import type { Card } from "../../types";
import {
  createCardId,
  createDeck,
  createNewGameState,
  hasAlternatingColors,
  isBlackCard,
  isRedCard,
  shuffleDeck,
} from "../index";

describe("Game Utils", () => {
  describe("createCardId", () => {
    it("should create correct card ID for hearts", () => {
      const id = createCardId("hearts", 1);
      expect(id).toBe("hearts-1");
    });

    it("should create correct card ID for spades", () => {
      const id = createCardId("spades", 13);
      expect(id).toBe("spades-13");
    });

    it("should create correct card ID for diamonds", () => {
      const id = createCardId("diamonds", 7);
      expect(id).toBe("diamonds-7");
    });

    it("should create correct card ID for clubs", () => {
      const id = createCardId("clubs", 12);
      expect(id).toBe("clubs-12");
    });
  });

  describe("isRedCard", () => {
    it("should return true for hearts", () => {
      const card: Card = {
        suit: "hearts",
        rank: 1,
        faceUp: true,
        id: "hearts-1",
      };
      expect(isRedCard(card)).toBe(true);
    });

    it("should return true for diamonds", () => {
      const card: Card = {
        suit: "diamonds",
        rank: 5,
        faceUp: true,
        id: "diamonds-5",
      };
      expect(isRedCard(card)).toBe(true);
    });

    it("should return false for clubs", () => {
      const card: Card = {
        suit: "clubs",
        rank: 10,
        faceUp: true,
        id: "clubs-10",
      };
      expect(isRedCard(card)).toBe(false);
    });

    it("should return false for spades", () => {
      const card: Card = {
        suit: "spades",
        rank: 13,
        faceUp: true,
        id: "spades-13",
      };
      expect(isRedCard(card)).toBe(false);
    });
  });

  describe("isBlackCard", () => {
    it("should return true for clubs", () => {
      const card: Card = {
        suit: "clubs",
        rank: 3,
        faceUp: true,
        id: "clubs-3",
      };
      expect(isBlackCard(card)).toBe(true);
    });

    it("should return true for spades", () => {
      const card: Card = {
        suit: "spades",
        rank: 8,
        faceUp: true,
        id: "spades-8",
      };
      expect(isBlackCard(card)).toBe(true);
    });

    it("should return false for hearts", () => {
      const card: Card = {
        suit: "hearts",
        rank: 6,
        faceUp: true,
        id: "hearts-6",
      };
      expect(isBlackCard(card)).toBe(false);
    });

    it("should return false for diamonds", () => {
      const card: Card = {
        suit: "diamonds",
        rank: 11,
        faceUp: true,
        id: "diamonds-11",
      };
      expect(isBlackCard(card)).toBe(false);
    });
  });

  describe("hasAlternatingColors", () => {
    it("should return true for red card and black card", () => {
      const redCard: Card = {
        suit: "hearts",
        rank: 7,
        faceUp: true,
        id: "hearts-7",
      };
      const blackCard: Card = {
        suit: "spades",
        rank: 8,
        faceUp: true,
        id: "spades-8",
      };
      expect(hasAlternatingColors(redCard, blackCard)).toBe(true);
    });

    it("should return true for black card and red card", () => {
      const blackCard: Card = {
        suit: "clubs",
        rank: 9,
        faceUp: true,
        id: "clubs-9",
      };
      const redCard: Card = {
        suit: "diamonds",
        rank: 8,
        faceUp: true,
        id: "diamonds-8",
      };
      expect(hasAlternatingColors(blackCard, redCard)).toBe(true);
    });

    it("should return false for two red cards", () => {
      const redCard1: Card = {
        suit: "hearts",
        rank: 5,
        faceUp: true,
        id: "hearts-5",
      };
      const redCard2: Card = {
        suit: "diamonds",
        rank: 4,
        faceUp: true,
        id: "diamonds-4",
      };
      expect(hasAlternatingColors(redCard1, redCard2)).toBe(false);
    });

    it("should return false for two black cards", () => {
      const blackCard1: Card = {
        suit: "clubs",
        rank: 2,
        faceUp: true,
        id: "clubs-2",
      };
      const blackCard2: Card = {
        suit: "spades",
        rank: 1,
        faceUp: true,
        id: "spades-1",
      };
      expect(hasAlternatingColors(blackCard1, blackCard2)).toBe(false);
    });
  });

  describe("createDeck", () => {
    it("should create a deck with 52 cards", () => {
      const deck = createDeck();
      expect(deck).toHaveLength(52);
    });

    it("should have 13 cards of each suit", () => {
      const deck = createDeck();
      const suits = ["hearts", "diamonds", "clubs", "spades"];

      suits.forEach(suit => {
        const suitCards = deck.filter(card => card.suit === suit);
        expect(suitCards).toHaveLength(13);
      });
    });

    it("should have cards ranked 1 through 13 for each suit", () => {
      const deck = createDeck();
      const suits = ["hearts", "diamonds", "clubs", "spades"];

      suits.forEach(suit => {
        const suitCards = deck.filter(card => card.suit === suit);
        const ranks = suitCards.map(card => card.rank).sort((a, b) => a - b);
        const expectedRanks = Array.from({ length: 13 }, (_, i) => i + 1);
        expect(ranks).toEqual(expectedRanks);
      });
    });

    it("should create cards with correct IDs", () => {
      const deck = createDeck();
      deck.forEach(card => {
        expect(card.id).toBe(createCardId(card.suit, card.rank));
      });
    });

    it("should create all cards face down by default", () => {
      const deck = createDeck();
      deck.forEach(card => {
        expect(card.faceUp).toBe(false);
      });
    });
  });

  describe("shuffleDeck", () => {
    it("should return a deck with the same number of cards", () => {
      const deck = createDeck();
      const shuffled = shuffleDeck(deck);
      expect(shuffled).toHaveLength(deck.length);
    });

    it("should contain the same cards", () => {
      const deck = createDeck();
      const shuffled = shuffleDeck(deck);

      deck.forEach(card => {
        expect(shuffled.find(c => c.id === card.id)).toBeDefined();
      });
    });

    it("should not modify the original deck", () => {
      const deck = createDeck();
      const originalFirst = deck[0];
      shuffleDeck(deck);
      expect(deck[0]).toBe(originalFirst);
    });

    it("should actually shuffle the cards (very high probability)", () => {
      const deck = createDeck();
      const shuffled = shuffleDeck(deck);

      // Check that at least some cards are in different positions
      let differences = 0;
      for (let i = 0; i < deck.length; i++) {
        if (deck[i].id !== shuffled[i].id) {
          differences++;
        }
      }

      // With a proper shuffle, we expect most cards to be in different positions
      expect(differences).toBeGreaterThan(deck.length * 0.7);
    });
  });

  describe("createNewGameState", () => {
    it("should create a valid Klondike solitaire setup", () => {
      const gameState = createNewGameState();

      // Check tableau structure
      expect(gameState.tableau).toHaveLength(7);

      // Check tableau card counts (1, 2, 3, 4, 5, 6, 7)
      for (let i = 0; i < 7; i++) {
        expect(gameState.tableau[i]).toHaveLength(i + 1);
      }

      // Check foundations (4 empty piles)
      expect(gameState.foundations).toHaveLength(4);
      gameState.foundations.forEach(foundation => {
        expect(foundation).toHaveLength(0);
      });

      // Check waste is empty
      expect(gameState.waste).toHaveLength(0);

      // Check stock has remaining cards
      const tableauCardCount = gameState.tableau.reduce((sum, col) => sum + col.length, 0);
      expect(gameState.stock).toHaveLength(52 - tableauCardCount);
    });

    it("should have only bottom cards face up in tableau", () => {
      const gameState = createNewGameState();

      gameState.tableau.forEach(column => {
        column.forEach((card, index) => {
          if (index === column.length - 1) {
            // Bottom card should be face up
            expect(card.faceUp).toBe(true);
          } else {
            // All other cards should be face down
            expect(card.faceUp).toBe(false);
          }
        });
      });
    });

    it("should have all stock cards face down", () => {
      const gameState = createNewGameState();

      gameState.stock.forEach(card => {
        expect(card.faceUp).toBe(false);
      });
    });

    it("should use all 52 cards exactly once", () => {
      const gameState = createNewGameState();

      // Collect all cards from all areas
      const allCards: Card[] = [];

      gameState.tableau.forEach(column => {
        allCards.push(...column);
      });

      gameState.foundations.forEach(foundation => {
        allCards.push(...foundation);
      });

      allCards.push(...gameState.stock);
      allCards.push(...gameState.waste);

      // Should have exactly 52 cards
      expect(allCards).toHaveLength(52);

      // All cards should have unique IDs
      const cardIds = allCards.map(card => card.id);
      const uniqueIds = new Set(cardIds);
      expect(uniqueIds.size).toBe(52);

      // Should have all expected cards
      const expectedDeck = createDeck();
      expectedDeck.forEach(expectedCard => {
        expect(allCards.find(card => card.id === expectedCard.id)).toBeDefined();
      });
    });

    it("should create different game states on multiple calls", () => {
      const gameState1 = createNewGameState();
      const gameState2 = createNewGameState();

      // While the structure should be the same, the cards should be different due to shuffling
      let differences = 0;

      for (let col = 0; col < 7; col++) {
        for (let row = 0; row < gameState1.tableau[col].length; row++) {
          if (gameState1.tableau[col][row].id !== gameState2.tableau[col][row].id) {
            differences++;
          }
        }
      }

      // Expect significant differences due to shuffling
      expect(differences).toBeGreaterThan(10);
    });

    it("should properly deal tableau cards in sequence", () => {
      const gameState = createNewGameState();

      // Verify that we have the correct number of cards in each column
      const expectedCounts = [1, 2, 3, 4, 5, 6, 7];

      gameState.tableau.forEach((column, index) => {
        expect(column).toHaveLength(expectedCounts[index]);
      });

      // Total tableau cards should be 1+2+3+4+5+6+7 = 28
      const totalTableauCards = gameState.tableau.reduce((sum, col) => sum + col.length, 0);
      expect(totalTableauCards).toBe(28);

      // Stock should have the remaining 24 cards
      expect(gameState.stock).toHaveLength(24);
    });
  });
});
