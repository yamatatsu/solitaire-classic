import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WinDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
}

/**
 * Modal dialog component that displays when the player wins the game
 */
export const WinDialog: React.FC<WinDialogProps> = ({
  isOpen,
  onClose,
  onNewGame,
}) => {
  const handleNewGame = () => {
    onNewGame();
    // onNewGame already handles closing the dialog by resetting showWinMessage
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4",
          "animate-in zoom-in-95 duration-200"
        )}
      >
        {/* Header */}
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            🎉 Congratulations!
          </h2>
          <p className="text-lg text-gray-700">
            You have successfully completed the game!
          </p>
          <p className="text-sm text-gray-500 mt-2">
            All cards have been moved to the foundations.
          </p>
        </div>

        {/* Body */}
        <div className="text-center py-4">
          <div className="text-6xl mb-4">🏆</div>
          <p className="text-gray-600">
            Great job! Would you like to play again?
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-2 p-6 pt-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button onClick={handleNewGame} className="w-full sm:w-auto">
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
};
