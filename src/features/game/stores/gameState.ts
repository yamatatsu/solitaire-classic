import { atom } from "jotai";
import type { GameState } from "../types";
import { foundationsAtom } from "./foundations";
import { stockAtom } from "./stock";
import { tableauAtom } from "./tableau";
import { wasteAtom } from "./waste";

// Derived atom that combines all game state atoms
export const gameStateAtom = atom<GameState>((get) => {
  return {
    tableau: get(tableauAtom),
    foundations: get(foundationsAtom),
    stock: get(stockAtom),
    waste: get(wasteAtom),
  };
});

// Action to reset the entire game state
export const resetGameState = atom(
  null,
  (get, set, { gameState }: { gameState?: GameState } = {}) => {
    if (gameState) {
      // Validate the provided game state
      if (!Array.isArray(gameState.tableau) || gameState.tableau.length !== 7) {
        throw new Error(
          "Invalid game state: tableau must have exactly 7 columns"
        );
      }

      if (
        !Array.isArray(gameState.foundations) ||
        gameState.foundations.length !== 4
      ) {
        throw new Error(
          "Invalid game state: foundations must have exactly 4 piles"
        );
      }

      if (!Array.isArray(gameState.stock)) {
        throw new Error("Invalid game state: stock must be an array");
      }

      if (!Array.isArray(gameState.waste)) {
        throw new Error("Invalid game state: waste must be an array");
      }

      // Set all atoms to the provided state
      set(tableauAtom, gameState.tableau);
      set(foundationsAtom, gameState.foundations);
      set(stockAtom, gameState.stock);
      set(wasteAtom, gameState.waste);
    } else {
      // Reset to initial empty state
      set(
        tableauAtom,
        Array.from({ length: 7 }, () => [])
      );
      set(
        foundationsAtom,
        Array.from({ length: 4 }, () => [])
      );
      set(stockAtom, []);
      set(wasteAtom, []);
    }
  }
);

// Derived atom to check if the game is won
export const isGameWon = atom<boolean>((get) => {
  const foundations = get(foundationsAtom);

  // Game is won when all 4 foundations have complete sequences (Ace to King)
  return foundations.every((foundation) => {
    if (foundation.length !== 13) {
      return false;
    }

    // Check that the sequence is correct (1 to 13)
    for (let i = 0; i < foundation.length; i++) {
      if (foundation[i].rank !== i + 1) {
        return false;
      }
    }

    return true;
  });
});
