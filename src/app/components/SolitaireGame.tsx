import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { GameBoard } from "@/features/game/components/GameBoard";
import { useGameControls, useGameActions } from "@/features/game/hooks";
import { WinDialog } from "./WinDialog";

interface SolitaireGameProps {
  className?: string;
}

/**
 * Main solitaire game component that integrates all game functionality
 * Includes the game board, controls, and win detection
 */
export const SolitaireGame: React.FC<SolitaireGameProps> = ({ className }) => {
  const {
    gameState,
    isGameWon,
    showWinMessage,
    startNewGame,
    dismissWinMessage,
  } = useGameControls();

  const {
    onTableauCardClick,
    onTableauColumnClick,
    onFoundationClick,
    onFoundationCardClick,
    onStockClick,
    onWasteClick,
    onWasteCardClick,
  } = useGameActions();

  return (
    <div className={cn("relative", className)}>
      {/* Game Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Solitaire Classic
            </h1>
            <p className="text-sm text-gray-600">
              Klondike Solitaire - Complete MVP
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Game Status */}
            <div className="text-sm text-gray-600">
              {isGameWon ? (
                <span className="text-green-600 font-semibold">🎉 You Won!</span>
              ) : (
                <span>Game in Progress</span>
              )}
            </div>

            {/* New Game Button */}
            <Button
              onClick={startNewGame}
              variant="default"
              size="default"
              className="font-semibold"
            >
              New Game
            </Button>
          </div>
        </div>
      </header>

      {/* Game Board */}
      <main className="relative">
        <GameBoard
          gameState={gameState}
          onTableauCardClick={onTableauCardClick}
          onTableauColumnClick={onTableauColumnClick}
          onFoundationClick={onFoundationClick}
          onFoundationCardClick={onFoundationCardClick}
          onStockClick={onStockClick}
          onWasteClick={onWasteClick}
          onWasteCardClick={onWasteCardClick}
          className="min-h-[calc(100vh-80px)]"
        />
      </main>

      {/* Win Dialog */}
      <WinDialog
        isOpen={showWinMessage}
        onClose={dismissWinMessage}
        onNewGame={startNewGame}
      />
    </div>
  );
};