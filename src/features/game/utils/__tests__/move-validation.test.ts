import { describe, expect, it } from "vitest";
import type { Card, Rank, Suit } from "../../types";
import {
  areColorsAlternating,
  canFlipTableauCard,
  getCardColor,
  getRankValue,
  isRankSequential,
  isValidFoundationMove,
  isValidTableauMove,
  isValidTableauToFoundation,
  isValidTableauToTableau,
  isValidWasteToFoundation,
  isValidWasteToTableau,
} from "../move-validation";

// Test helper functions for creating cards
const createCard = (suit: Suit, rank: Rank, faceUp = true): Card => ({
  suit,
  rank,
  faceUp,
  id: `${suit}-${rank}`,
});

describe("Klondike Rules Validation", () => {
  describe("Helper Functions", () => {
    describe("getCardColor", () => {
      it("should return red for hearts", () => {
        const card = createCard("hearts", 5);
        expect(getCardColor(card)).toBe("red");
      });

      it("should return red for diamonds", () => {
        const card = createCard("diamonds", 10);
        expect(getCardColor(card)).toBe("red");
      });

      it("should return black for clubs", () => {
        const card = createCard("clubs", 7);
        expect(getCardColor(card)).toBe("black");
      });

      it("should return black for spades", () => {
        const card = createCard("spades", 1);
        expect(getCardColor(card)).toBe("black");
      });
    });

    describe("getRankValue", () => {
      it("should return correct numeric value for all ranks", () => {
        expect(getRankValue(1)).toBe(1); // Ace
        expect(getRankValue(2)).toBe(2);
        expect(getRankValue(10)).toBe(10);
        expect(getRankValue(11)).toBe(11); // Jack
        expect(getRankValue(12)).toBe(12); // Queen
        expect(getRankValue(13)).toBe(13); // King
      });
    });

    describe("isRankSequential", () => {
      it("should return true for sequential descending ranks", () => {
        expect(isRankSequential(8, 7)).toBe(true);
        expect(isRankSequential(13, 12)).toBe(true); // King to Queen
        expect(isRankSequential(2, 1)).toBe(true); // 2 to Ace
      });

      it("should return false for non-sequential ranks", () => {
        expect(isRankSequential(8, 6)).toBe(false);
        expect(isRankSequential(5, 7)).toBe(false);
        expect(isRankSequential(1, 2)).toBe(false); // Ascending
      });

      it("should return false for same rank", () => {
        expect(isRankSequential(7, 7)).toBe(false);
      });
    });

    describe("areColorsAlternating", () => {
      it("should return true for alternating colors", () => {
        const redCard = createCard("hearts", 8);
        const blackCard = createCard("spades", 7);
        expect(areColorsAlternating(redCard, blackCard)).toBe(true);
        expect(areColorsAlternating(blackCard, redCard)).toBe(true);
      });

      it("should return false for same colors", () => {
        const redCard1 = createCard("hearts", 8);
        const redCard2 = createCard("diamonds", 7);
        const blackCard1 = createCard("clubs", 8);
        const blackCard2 = createCard("spades", 7);

        expect(areColorsAlternating(redCard1, redCard2)).toBe(false);
        expect(areColorsAlternating(blackCard1, blackCard2)).toBe(false);
      });
    });
  });

  describe("Foundation Moves", () => {
    describe("isValidFoundationMove", () => {
      it("should allow Ace on empty foundation", () => {
        const ace = createCard("hearts", 1);
        expect(isValidFoundationMove(ace, [])).toBe(true);
      });

      it("should not allow non-Ace on empty foundation", () => {
        const king = createCard("hearts", 13);
        const five = createCard("spades", 5);
        expect(isValidFoundationMove(king, [])).toBe(false);
        expect(isValidFoundationMove(five, [])).toBe(false);
      });

      it("should allow same suit ascending sequence", () => {
        const ace = createCard("hearts", 1);
        const two = createCard("hearts", 2);
        const three = createCard("hearts", 3);

        expect(isValidFoundationMove(two, [ace])).toBe(true);
        expect(isValidFoundationMove(three, [ace, two])).toBe(true);
      });

      it("should not allow different suit", () => {
        const aceHearts = createCard("hearts", 1);
        const twoSpades = createCard("spades", 2);

        expect(isValidFoundationMove(twoSpades, [aceHearts])).toBe(false);
      });

      it("should not allow non-sequential ranks", () => {
        const ace = createCard("hearts", 1);
        const three = createCard("hearts", 3);
        const five = createCard("hearts", 5);

        expect(isValidFoundationMove(three, [ace])).toBe(false);
        expect(isValidFoundationMove(five, [ace])).toBe(false);
      });
    });

    describe("isValidTableauToFoundation", () => {
      it("should validate moving card from tableau to foundation", () => {
        const ace = createCard("hearts", 1);
        expect(isValidTableauToFoundation(ace, [])).toBe(true);

        const two = createCard("hearts", 2);
        expect(isValidTableauToFoundation(two, [ace])).toBe(true);
      });

      it("should reject invalid foundation moves", () => {
        const king = createCard("hearts", 13);
        expect(isValidTableauToFoundation(king, [])).toBe(false);

        const aceHearts = createCard("hearts", 1);
        const twoSpades = createCard("spades", 2);
        expect(isValidTableauToFoundation(twoSpades, [aceHearts])).toBe(false);
      });
    });

    describe("isValidWasteToFoundation", () => {
      it("should validate moving card from waste to foundation", () => {
        const ace = createCard("clubs", 1);
        expect(isValidWasteToFoundation(ace, [])).toBe(true);

        const two = createCard("clubs", 2);
        expect(isValidWasteToFoundation(two, [ace])).toBe(true);
      });

      it("should reject invalid foundation moves from waste", () => {
        const king = createCard("clubs", 13);
        expect(isValidWasteToFoundation(king, [])).toBe(false);
      });
    });
  });

  describe("Tableau Moves", () => {
    describe("isValidTableauMove", () => {
      it("should allow King on empty tableau column", () => {
        const king = createCard("hearts", 13);
        expect(isValidTableauMove([king], [])).toBe(true);
      });

      it("should not allow non-King on empty tableau column", () => {
        const queen = createCard("hearts", 12);
        const ace = createCard("spades", 1);
        expect(isValidTableauMove([queen], [])).toBe(false);
        expect(isValidTableauMove([ace], [])).toBe(false);
      });

      it("should allow alternating color descending sequence", () => {
        const blackKing = createCard("spades", 13);
        const redQueen = createCard("hearts", 12);
        const blackJack = createCard("clubs", 11);

        const targetColumn = [blackKing];
        expect(isValidTableauMove([redQueen], targetColumn)).toBe(true);

        const targetColumn2 = [blackKing, redQueen];
        expect(isValidTableauMove([blackJack], targetColumn2)).toBe(true);
      });

      it("should not allow same color sequence", () => {
        const redKing = createCard("hearts", 13);
        const redQueen = createCard("diamonds", 12);

        const targetColumn = [redKing];
        expect(isValidTableauMove([redQueen], targetColumn)).toBe(false);
      });

      it("should not allow non-sequential ranks", () => {
        const blackKing = createCard("spades", 13);
        const redJack = createCard("hearts", 11);

        const targetColumn = [blackKing];
        expect(isValidTableauMove([redJack], targetColumn)).toBe(false);
      });

      it("should validate multiple card sequences", () => {
        const blackKing = createCard("spades", 13);
        const redQueen = createCard("hearts", 12);
        const blackJack = createCard("clubs", 11);
        const redTen = createCard("diamonds", 10);

        const targetColumn = [blackKing];
        const cardsToMove = [redQueen, blackJack, redTen];

        expect(isValidTableauMove(cardsToMove, targetColumn)).toBe(true);
      });

      it("should reject invalid multiple card sequences", () => {
        const blackKing = createCard("spades", 13);
        const redQueen = createCard("hearts", 12);
        const redJack = createCard("diamonds", 11); // Same color as Queen

        const targetColumn = [blackKing];
        const cardsToMove = [redQueen, redJack];

        expect(isValidTableauMove(cardsToMove, targetColumn)).toBe(false);
      });

      it("should reject empty cards array", () => {
        const blackKing = createCard("spades", 13);
        const targetColumn = [blackKing];

        expect(isValidTableauMove([], targetColumn)).toBe(false);
      });

      it("should reject non-sequential ranks in multi-card sequence", () => {
        const blackKing = createCard("spades", 13);
        const redQueen = createCard("hearts", 12);
        const blackTen = createCard("clubs", 10); // Skips Jack (11)

        const targetColumn = [blackKing];
        const cardsToMove = [redQueen, blackTen];

        expect(isValidTableauMove(cardsToMove, targetColumn)).toBe(false);
      });
    });

    describe("isValidTableauToTableau", () => {
      it("should validate moving cards between tableau columns", () => {
        const blackKing = createCard("spades", 13);
        const redQueen = createCard("hearts", 12);

        const targetColumn = [blackKing];
        expect(isValidTableauToTableau([redQueen], targetColumn)).toBe(true);
      });

      it("should reject invalid tableau to tableau moves", () => {
        const redKing = createCard("hearts", 13);
        const redQueen = createCard("diamonds", 12);

        const targetColumn = [redKing];
        expect(isValidTableauToTableau([redQueen], targetColumn)).toBe(false);
      });
    });

    describe("isValidWasteToTableau", () => {
      it("should validate moving card from waste to tableau", () => {
        const blackKing = createCard("spades", 13);
        const redQueen = createCard("hearts", 12);

        const targetColumn = [blackKing];
        expect(isValidWasteToTableau(redQueen, targetColumn)).toBe(true);
      });

      it("should allow King on empty tableau from waste", () => {
        const king = createCard("clubs", 13);
        expect(isValidWasteToTableau(king, [])).toBe(true);
      });

      it("should reject invalid waste to tableau moves", () => {
        const redKing = createCard("hearts", 13);
        const redQueen = createCard("diamonds", 12);

        const targetColumn = [redKing];
        expect(isValidWasteToTableau(redQueen, targetColumn)).toBe(false);
      });
    });
  });

  describe("Card Flipping", () => {
    describe("canFlipTableauCard", () => {
      it("should allow flipping face-down card that is the last card", () => {
        const faceDownCard = createCard("hearts", 7, false);
        const column = [faceDownCard];

        expect(canFlipTableauCard(column, 0)).toBe(true);
      });

      it("should allow flipping face-down card that has no face-up cards after it", () => {
        const faceDownCard1 = createCard("hearts", 8, false);
        const faceDownCard2 = createCard("spades", 7, false);
        const faceDownCard3 = createCard("diamonds", 6, false);
        const column = [faceDownCard1, faceDownCard2, faceDownCard3];

        expect(canFlipTableauCard(column, 2)).toBe(true); // Last card
        expect(canFlipTableauCard(column, 1)).toBe(false); // Has cards after it
        expect(canFlipTableauCard(column, 0)).toBe(false); // Has cards after it
      });

      it("should not allow flipping face-up card", () => {
        const faceUpCard = createCard("hearts", 7, true);
        const column = [faceUpCard];

        expect(canFlipTableauCard(column, 0)).toBe(false);
      });

      it("should not allow flipping card with any cards after it", () => {
        const faceDownCard = createCard("hearts", 8, false);
        const faceUpCard = createCard("spades", 7, true);
        const column = [faceDownCard, faceUpCard];

        expect(canFlipTableauCard(column, 0)).toBe(false);
      });

      it("should handle invalid indices gracefully", () => {
        const card = createCard("hearts", 7);
        const column = [card];

        expect(canFlipTableauCard(column, -1)).toBe(false);
        expect(canFlipTableauCard(column, 1)).toBe(false);
        expect(canFlipTableauCard([], 0)).toBe(false);
      });

      it("should only allow flipping the topmost card when it's face-down", () => {
        const faceDownCard1 = createCard("hearts", 10, false);
        const faceDownCard2 = createCard("spades", 9, false);
        const faceUpCard1 = createCard("diamonds", 8, true);
        const faceUpCard2 = createCard("clubs", 7, true);

        // Test 1: Only last card flippable when all are face-down
        const allFaceDownColumn = [faceDownCard1, faceDownCard2];
        expect(canFlipTableauCard(allFaceDownColumn, 1)).toBe(true); // Last card
        expect(canFlipTableauCard(allFaceDownColumn, 0)).toBe(false); // Not last card

        // Test 2: Only last card flippable in mixed column
        const mixedColumn = [
          faceDownCard1,
          faceDownCard2,
          faceUpCard1,
          faceUpCard2,
        ];
        expect(canFlipTableauCard(mixedColumn, 3)).toBe(false); // Last card but face-up
        expect(canFlipTableauCard(mixedColumn, 2)).toBe(false); // Face-up
        expect(canFlipTableauCard(mixedColumn, 1)).toBe(false); // Not last card
        expect(canFlipTableauCard(mixedColumn, 0)).toBe(false); // Not last card
      });
    });
  });
});
