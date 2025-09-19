import type React from "react";
import { cn } from "@/lib/utils";
import type { GameState } from "../types";
import { Foundation } from "./Foundation";
import { Stock } from "./Stock";
import { Tableau } from "./Tableau";
import { Waste } from "./Waste";

interface GameBoardProps {
  gameState: GameState;
  onTableauCardClick?: (
    cardId: string,
    columnIndex: number,
    cardIndex: number
  ) => void;
  onTableauColumnClick?: (columnIndex: number) => void;
  onFoundationClick?: (foundationIndex: number) => void;
  onFoundationCardClick?: (cardId: string, foundationIndex: number) => void;
  onStockClick?: () => void;
  onWasteClick?: () => void;
  onWasteCardClick?: (cardId: string, cardIndex: number) => void;
  className?: string;
  "data-testid"?: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  gameState,
  onTableauCardClick,
  onTableauColumnClick,
  onFoundationClick,
  onFoundationCardClick,
  onStockClick,
  onWasteClick,
  onWasteCardClick,
  className,
  "data-testid": testId,
}) => {
  return (
    <div
      className={cn(
        "w-full min-h-screen bg-green-600 p-4",
        "flex flex-col gap-6",
        // Responsive breakpoints
        "sm:p-6 md:p-8",
        "min-w-[320px]", // Support minimum width
        className
      )}
      data-testid={testId || "game-board"}
      role="main"
      aria-label="Solitaire Game Board"
    >
      {/* Top area - Foundation and Stock/Waste */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
        {/* Foundation area */}
        <div className="flex flex-col items-center sm:items-start">
          <h2 className="text-white text-sm font-semibold mb-2 sm:mb-3">
            Foundation
          </h2>
          <Foundation
            foundations={gameState.foundations}
            onFoundationClick={onFoundationClick}
            onCardClick={onFoundationCardClick}
            data-testid="game-foundation"
          />
        </div>

        {/* Stock and Waste area */}
        <div className="flex flex-col items-center sm:items-end">
          <h2 className="text-white text-sm font-semibold mb-2 sm:mb-3">
            Stock & Waste
          </h2>
          <div className="flex gap-3 items-start">
            <div className="flex flex-col items-center">
              <div className="text-white text-xs mb-1">Stock</div>
              <Stock
                cards={gameState.stock}
                onStockClick={onStockClick}
                data-testid="game-stock"
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="text-white text-xs mb-1">Waste</div>
              <Waste
                cards={gameState.waste}
                onCardClick={onWasteCardClick}
                onWasteClick={onWasteClick}
                data-testid="game-waste"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-green-500 opacity-50" />

      {/* Tableau area */}
      <div className="flex-1 flex flex-col">
        <h2 className="text-white text-sm font-semibold mb-3 text-center sm:text-left">
          Tableau
        </h2>
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-4xl">
            <Tableau
              columns={gameState.tableau}
              onCardClick={onTableauCardClick}
              onColumnClick={onTableauColumnClick}
              data-testid="game-tableau"
            />
          </div>
        </div>
      </div>

      {/* Game info footer */}
      <div className="flex justify-center items-center text-white text-xs opacity-75">
        <div className="flex gap-4 text-center">
          <div>Stock: {gameState.stock.length}</div>
          <div>Waste: {gameState.waste.length}</div>
          <div>
            Foundations:{" "}
            {gameState.foundations.reduce((sum, pile) => sum + pile.length, 0)}
          </div>
          <div>
            Tableau:{" "}
            {gameState.tableau.reduce((sum, column) => sum + column.length, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};
