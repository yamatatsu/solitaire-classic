// Game logic and validation utilities
import type { Card, Suit } from '../types';

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
  return card.suit === 'hearts' || card.suit === 'diamonds';
};

/**
 * Checks if a card is black (clubs or spades)
 */
export const isBlackCard = (card: Card): boolean => {
  return card.suit === 'clubs' || card.suit === 'spades';
};

/**
 * Checks if two cards have alternating colors
 */
export const hasAlternatingColors = (card1: Card, card2: Card): boolean => {
  return isRedCard(card1) !== isRedCard(card2);
};