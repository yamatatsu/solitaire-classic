// Game state atoms and actions for solitaire game

// Tableau atoms and actions
export {
  tableauAtom,
  addCardToTableauColumn,
  removeCardFromTableauColumn,
  flipCardInTableau
} from './tableau';

// Foundations atoms and actions
export {
  foundationsAtom,
  addCardToFoundation,
  removeCardFromFoundation
} from './foundations';

// Stock atoms and actions
export {
  stockAtom,
  addCardToStock,
  removeCardFromStock,
  dealCardsFromStock,
  resetStock
} from './stock';

// Waste atoms and actions
export {
  wasteAtom,
  addCardToWaste,
  removeCardFromWaste,
  clearWaste
} from './waste';

// Game state atoms and actions
export {
  gameStateAtom,
  resetGameState,
  isGameWon
} from './gameState';

// Re-export types for convenience
export type { Card, GameState, MoveAction, ValidationResult } from '../types';