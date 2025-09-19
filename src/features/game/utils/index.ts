// Game logic and validation utilities
import type { Card, Suit } from "../types";

/**
 * Creates a unique ID for a card based on its suit and rank
 */
export const createCardId = (suit: Suit, rank: number): string => {
  return `${suit}-${rank}`;
};

/**
 * Checks if a card is red (hearts or diamonds)
 */
export const isRedCard = (card: Card): boolean => {
  return card.suit === "hearts" || card.suit === "diamonds";
};

/**
 * Checks if a card is black (clubs or spades)
 */
export const isBlackCard = (card: Card): boolean => {
  return card.suit === "clubs" || card.suit === "spades";
};

/**
 * Checks if two cards have alternating colors
 */
export const hasAlternatingColors = (card1: Card, card2: Card): boolean => {
  return isRedCard(card1) !== isRedCard(card2);
};

/**
 * Gets the color of a card for the color property
 */
export const getCardColor = (card: Card): "red" | "black" => {
  return card.suit === "hearts" || card.suit === "diamonds" ? "red" : "black";
};

/**
 * Creates a standard 52-card deck
 */
export const createDeck = (): Card[] => {
  const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
  const deck: Card[] = [];

  suits.forEach((suit) => {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({
        id: createCardId(suit, rank),
        suit,
        rank: rank as Card["rank"],
        faceUp: false,
      });
    }
  });

  return deck;
};

/**
 * Shuffles an array of cards using Fisher-Yates algorithm
 */
export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Parses a game location string to extract location type and index
 */
export const parseGameLocation = (
  location: string
): { type: string; index?: number } => {
  if (location === "stock" || location === "waste") {
    return { type: location };
  }

  const [type, indexStr] = location.split("-");
  const index = parseInt(indexStr, 10);

  if (isNaN(index)) {
    throw new Error(`Invalid location format: ${location}`);
  }

  return { type, index };
};

/**
 * Creates a game location string from type and optional index
 */
export const createGameLocation = (type: string, index?: number): string => {
  if (type === "stock" || type === "waste") {
    return type;
  }

  if (index === undefined) {
    throw new Error(`Index required for location type: ${type}`);
  }

  return `${type}-${index}`;
};

/**
 * Creates a new Klondike solitaire game setup
 * Deals cards according to standard Klondike rules:
 * - 7 tableau columns with 1, 2, 3, 4, 5, 6, 7 cards respectively
 * - Only the top card in each column is face up
 * - Remaining cards go to stock
 * - Foundations and waste start empty
 */
export const createNewGameState = (): {
  tableau: Card[][];
  foundations: Card[][];
  stock: Card[];
  waste: Card[];
} => {
  // Create and shuffle deck
  const deck = shuffleDeck(createDeck());
  let cardIndex = 0;

  // Deal tableau columns
  const tableau: Card[][] = [];
  for (let col = 0; col < 7; col++) {
    const column: Card[] = [];
    // Deal cards for this column (column index + 1 cards)
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[cardIndex] };
      // Only the bottom card (last dealt) is face up
      card.faceUp = row === col;
      column.push(card);
      cardIndex++;
    }
    tableau.push(column);
  }

  // Remaining cards go to stock (all face down)
  const stock = deck
    .slice(cardIndex)
    .map((card) => ({ ...card, faceUp: false }));

  // Empty foundations and waste
  const foundations = Array.from({ length: 4 }, () => [] as Card[]);
  const waste: Card[] = [];

  return {
    tableau,
    foundations,
    stock,
    waste,
  };
};
