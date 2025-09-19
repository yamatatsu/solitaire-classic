// Klondike Solitaire Move Validation Functions
// Implements comprehensive rule validation for all game moves

import type { Card, Rank } from "../types";

/**
 * Gets the color of a card (red for hearts/diamonds, black for clubs/spades)
 */
export const getCardColor = (card: Card): "red" | "black" => {
  return card.suit === "hearts" || card.suit === "diamonds" ? "red" : "black";
};

/**
 * Gets the numeric value of a rank (1-13)
 */
export const getRankValue = (rank: Rank): number => {
  return rank;
};

/**
 * Checks if two ranks are sequential in descending order (for tableau)
 */
export const isRankSequential = (
  higherRank: Rank,
  lowerRank: Rank
): boolean => {
  return getRankValue(higherRank) === getRankValue(lowerRank) + 1;
};

/**
 * Checks if two cards have alternating colors
 */
export const areColorsAlternating = (card1: Card, card2: Card): boolean => {
  return getCardColor(card1) !== getCardColor(card2);
};

/**
 * Validates if a card can be moved to a foundation pile
 * Foundation rules: Ace starts, same suit, ascending sequence
 */
export const isValidFoundationMove = (
  card: Card,
  foundationPile: Card[]
): boolean => {
  // Empty foundation - only Ace allowed
  if (foundationPile.length === 0) {
    return getRankValue(card.rank) === 1; // Ace
  }

  const topCard = foundationPile[foundationPile.length - 1];

  // Must be same suit
  if (card.suit !== topCard.suit) {
    return false;
  }

  // Must be next rank in ascending sequence
  return getRankValue(card.rank) === getRankValue(topCard.rank) + 1;
};

/**
 * Validates if cards can be moved to a tableau column
 * Tableau rules: King on empty, alternating colors, descending sequence
 */
export const isValidTableauMove = (
  cardsToMove: Card[],
  targetColumn: Card[]
): boolean => {
  if (cardsToMove.length === 0) {
    return false;
  }

  // Empty tableau column - only King allowed
  if (targetColumn.length === 0) {
    return getRankValue(cardsToMove[0].rank) === 13; // King
  }

  const topCardInTarget = targetColumn[targetColumn.length - 1];
  const bottomCardToMove = cardsToMove[0];

  // Must have alternating colors
  if (!areColorsAlternating(topCardInTarget, bottomCardToMove)) {
    return false;
  }

  // Must be sequential descending
  if (!isRankSequential(topCardInTarget.rank, bottomCardToMove.rank)) {
    return false;
  }

  // Validate internal sequence of cards being moved
  for (let i = 0; i < cardsToMove.length - 1; i++) {
    const currentCard = cardsToMove[i];
    const nextCard = cardsToMove[i + 1];

    // Must be sequential descending
    if (!isRankSequential(currentCard.rank, nextCard.rank)) {
      return false;
    }

    // Must have alternating colors
    if (!areColorsAlternating(currentCard, nextCard)) {
      return false;
    }
  }

  return true;
};

/**
 * Validates moving a card from tableau to foundation
 */
export const isValidTableauToFoundation = (
  card: Card,
  foundationPile: Card[]
): boolean => {
  return isValidFoundationMove(card, foundationPile);
};

/**
 * Validates moving cards from tableau to tableau
 */
export const isValidTableauToTableau = (
  cardsToMove: Card[],
  targetColumn: Card[]
): boolean => {
  return isValidTableauMove(cardsToMove, targetColumn);
};

/**
 * Validates moving a card from waste to tableau
 */
export const isValidWasteToTableau = (
  card: Card,
  targetColumn: Card[]
): boolean => {
  return isValidTableauMove([card], targetColumn);
};

/**
 * Validates moving a card from waste to foundation
 */
export const isValidWasteToFoundation = (
  card: Card,
  foundationPile: Card[]
): boolean => {
  return isValidFoundationMove(card, foundationPile);
};

/**
 * Checks if a tableau card can be flipped
 * Rules: Must be face-down and be the topmost (last) card in the column
 */
export const canFlipTableauCard = (
  column: Card[],
  cardIndex: number
): boolean => {
  // Validate index
  if (cardIndex < 0 || cardIndex >= column.length) {
    return false;
  }

  const card = column[cardIndex];

  // Must be face-down
  if (card.faceUp) {
    return false;
  }

  // Must be the last card in the column (topmost card)
  return cardIndex === column.length - 1;
};
