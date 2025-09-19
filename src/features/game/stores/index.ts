// Game state atoms and actions for solitaire game

// Re-export types for convenience
export type { Card, GameState, MoveAction, ValidationResult } from "../types";

// Foundations atoms and actions
export {
  addCardToFoundation,
  foundationsAtom,
  removeCardFromFoundation,
} from "./foundations";
// Game state atoms and actions
export {
  gameStateAtom,
  isGameWon,
  resetGameState,
} from "./gameState";
// Stock atoms and actions
export {
  addCardToStock,
  dealCardsFromStock,
  removeCardFromStock,
  resetStock,
  stockAtom,
} from "./stock";
// Tableau atoms and actions
export {
  addCardToTableauColumn,
  flipCardInTableau,
  removeCardFromTableauColumn,
  tableauAtom,
} from "./tableau";
// Waste atoms and actions
export {
  addCardToWaste,
  clearWaste,
  removeCardFromWaste,
  wasteAtom,
} from "./waste";
// Drag and drop atoms and actions
export {
  dragStateAtom,
  endDragAtom,
  endTouchAtom,
  isInteractingAtom,
  setDragPreviewAtom,
  setTouchTargetAtom,
  startDragAtom,
  startTouchAtom,
  touchStateAtom,
  updateDropTargetAtom,
  updateTouchAtom,
} from "./dragDrop";
