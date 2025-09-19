import { useCallback } from "react";
import { useDragAndDrop } from "./useDragAndDrop";
import { useStockPile } from "./useStockPile";

/**
 * Hook that provides game action handlers for the GameBoard component
 * Bridges the gap between the generic drag/drop system and specific game actions
 */
export const useGameActions = () => {
  // Initialize drag and drop with actual game move handling
  const {
    dragHandlers,
    touchHandlers,
  } = useDragAndDrop({
    onCardMove: (dragData, dropTarget) => {
      // TODO: Implement actual card move logic
      console.log("Card move:", dragData, dropTarget);
    },
    onCardFlip: (location, cardIndex) => {
      // TODO: Implement card flip logic
      console.log("Card flip:", location, cardIndex);
    },
  });

  // Initialize stock pile functionality
  const { drawFromStock } = useStockPile();

  // Create specific handlers for each game board interaction
  const onTableauCardClick = useCallback((cardId: string, columnIndex: number, cardIndex: number) => {
    // For now, just log the interaction
    // In a real implementation, this would trigger drag start or card selection
    console.log("Tableau card clicked:", { cardId, columnIndex, cardIndex });
  }, []);

  const onTableauColumnClick = useCallback((columnIndex: number) => {
    // Handle clicking on empty tableau column
    console.log("Tableau column clicked:", columnIndex);
  }, []);

  const onFoundationClick = useCallback((foundationIndex: number) => {
    // Handle clicking on empty foundation
    console.log("Foundation clicked:", foundationIndex);
  }, []);

  const onFoundationCardClick = useCallback((cardId: string, foundationIndex: number) => {
    // Handle clicking on foundation card (usually for auto-complete)
    console.log("Foundation card clicked:", { cardId, foundationIndex });
  }, []);

  const onStockClick = useCallback(() => {
    drawFromStock();
  }, [drawFromStock]);

  const onWasteClick = useCallback(() => {
    // Handle clicking on waste pile
    console.log("Waste pile clicked");
  }, []);

  const onWasteCardClick = useCallback((cardId: string, cardIndex: number) => {
    // Handle clicking on waste card
    console.log("Waste card clicked:", { cardId, cardIndex });
  }, []);

  return {
    onTableauCardClick,
    onTableauColumnClick,
    onFoundationClick,
    onFoundationCardClick,
    onStockClick,
    onWasteClick,
    onWasteCardClick,
    dragHandlers,
    touchHandlers,
  };
};