import { useAtom } from "jotai";
import { useCallback } from "react";
import type { Card } from "../types";
import {
  stockAtom,
  wasteAtom,
  addCardToWaste,
  removeCardFromStock,
  clearWaste,
  addCardToStock,
} from "../stores";

interface UseStockPileProps {
  drawCount?: 1 | 3; // Number of cards to draw from stock (Klondike variation)
  onStockClick?: () => void;
  onWasteClick?: (card: Card) => void;
}

interface UseStockPileReturn {
  stock: Card[];
  waste: Card[];
  canDrawFromStock: boolean;
  canRecycleStock: boolean;
  drawFromStock: () => void;
  recycleStock: () => void;
  getTopWasteCard: () => Card | null;
  getDrawableCards: () => Card[];
}

/**
 * Custom hook for managing stock pile interactions
 * Handles drawing cards from stock, recycling, and waste pile management
 */
export const useStockPile = ({
  drawCount = 3,
  onStockClick,
  onWasteClick,
}: UseStockPileProps = {}): UseStockPileReturn => {
  const [stock] = useAtom(stockAtom);
  const [waste] = useAtom(wasteAtom);
  const [, addToWaste] = useAtom(addCardToWaste);
  const [, removeFromStock] = useAtom(removeCardFromStock);
  const [, clearWastePile] = useAtom(clearWaste);
  const [, addToStock] = useAtom(addCardToStock);

  // Check if we can draw cards from stock
  const canDrawFromStock = stock.length > 0;

  // Check if we can recycle stock (waste has cards but stock is empty)
  const canRecycleStock = stock.length === 0 && waste.length > 0;

  /**
   * Gets the top card from waste pile (last card added)
   */
  const getTopWasteCard = useCallback((): Card | null => {
    return waste.length > 0 ? waste[waste.length - 1] : null;
  }, [waste]);

  /**
   * Gets cards that would be drawn based on draw count
   */
  const getDrawableCards = useCallback((): Card[] => {
    const cardsToTake = Math.min(drawCount, stock.length);
    return stock.slice(-cardsToTake);
  }, [stock, drawCount]);

  /**
   * Draws cards from stock to waste pile
   * In draw-3 mode, draws up to 3 cards; in draw-1 mode, draws 1 card
   */
  const drawFromStock = useCallback(() => {
    if (!canDrawFromStock) {
      return;
    }

    const cardsToTake = Math.min(drawCount, stock.length);
    const drawnCards = stock.slice(-cardsToTake);

    // Remove cards from stock (from the end)
    for (let i = 0; i < cardsToTake; i++) {
      removeFromStock({ count: 1 });
    }

    // Add cards to waste (flip them face up)
    drawnCards.forEach(card => {
      const flippedCard: Card = { ...card, faceUp: true };
      addToWaste({ card: flippedCard });
    });

    // Call optional callback
    if (onStockClick) {
      onStockClick();
    }
  }, [
    stock,
    drawCount,
    canDrawFromStock,
    removeFromStock,
    addToWaste,
    onStockClick,
  ]);

  /**
   * Recycles waste pile back to stock when stock is empty
   * All waste cards are moved back to stock face down in reverse order
   */
  const recycleStock = useCallback(() => {
    if (!canRecycleStock) {
      return;
    }

    // Move all waste cards back to stock in reverse order, face down
    const wasteCards = [...waste].reverse();

    // Clear waste pile first
    clearWastePile();

    // Add cards back to stock face down
    wasteCards.forEach(card => {
      const faceDownCard: Card = { ...card, faceUp: false };
      addToStock({ card: faceDownCard, faceDown: true });
    });

    // Call optional callback
    if (onStockClick) {
      onStockClick();
    }
  }, [
    waste,
    canRecycleStock,
    clearWastePile,
    addToStock,
    onStockClick,
  ]);

  return {
    stock,
    waste,
    canDrawFromStock,
    canRecycleStock,
    drawFromStock,
    recycleStock,
    getTopWasteCard,
    getDrawableCards,
  };
};