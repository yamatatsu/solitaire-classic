import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { gameStateAtom, isGameWon, resetGameState } from "../stores";
import { createNewGameState } from "../utils";

/**
 * Hook for managing game controls including new game creation,
 * win detection, and game state management
 */
export const useGameControls = () => {
  const gameState = useAtomValue(gameStateAtom);
  const isWon = useAtomValue(isGameWon);
  const resetGame = useSetAtom(resetGameState);

  const [showWinMessage, setShowWinMessage] = useState(false);
  const [gameId, setGameId] = useState(1); // Track game instances for testing
  const [winMessageDismissed, setWinMessageDismissed] = useState(false);

  // Handle win detection
  useEffect(() => {
    if (isWon && !showWinMessage && !winMessageDismissed) {
      setShowWinMessage(true);
    }
  }, [isWon, showWinMessage, winMessageDismissed]);

  /**
   * Starts a new game by creating a fresh game state
   */
  const startNewGame = useCallback(() => {
    const newGameState = createNewGameState();
    resetGame({ gameState: newGameState });
    setShowWinMessage(false);
    setWinMessageDismissed(false);
    setGameId((prev) => prev + 1);
  }, [resetGame]);

  /**
   * Dismisses the win message without starting a new game
   */
  const dismissWinMessage = useCallback(() => {
    setShowWinMessage(false);
    setWinMessageDismissed(true);
  }, []);

  /**
   * Resets the current game to initial empty state
   */
  const resetToEmpty = useCallback(() => {
    resetGame();
    setShowWinMessage(false);
    setWinMessageDismissed(false);
    setGameId((prev) => prev + 1);
  }, [resetGame]);

  return {
    gameState,
    isGameWon: isWon,
    showWinMessage,
    gameId,
    startNewGame,
    dismissWinMessage,
    resetToEmpty,
  };
};
