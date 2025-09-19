import type React from "react";
import { cn } from "@/lib/utils";
import type { Card as CardType } from "../types";
import { Card } from "./Card";

interface StockProps {
  cards: CardType[];
  onStockClick?: () => void;
  className?: string;
  "data-testid"?: string;
}

export const Stock: React.FC<StockProps> = ({
  cards,
  onStockClick,
  className,
  "data-testid": testId,
}) => {
  const hasCards = cards.length > 0;
  const topCard = hasCards ? cards[cards.length - 1] : null;

  const handleClick = () => {
    onStockClick?.();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onStockClick?.();
    }
  };

  if (!hasCards) {
    return (
      <button
        type="button"
        className={cn(
          "relative flex items-center justify-center",
          "w-16 h-24 min-h-[44px] min-w-[44px]", // Ensure touch targets
          "bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg",
          "hover:border-gray-400 hover:bg-gray-200 transition-all cursor-pointer",
          "shadow-sm"
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-testid={testId || "stock-empty"}
        aria-label="Empty stock pile - click to reset from waste"
      >
        <div className="flex flex-col items-center justify-center p-2">
          <div className="text-2xl text-gray-400 mb-1">↻</div>
          <div className="text-xs text-gray-400 font-medium">Reset</div>
        </div>
      </button>
    );
  }

  return (
    <section
      className={cn("relative", className)}
      data-testid={testId || "stock"}
      aria-label={`Stock pile with ${cards.length} cards`}
    >
      {/* Show multiple card backs to indicate stack depth */}
      {cards.length > 2 && (
        <div className="absolute top-1 left-1 w-16 h-24 bg-blue-500 border border-gray-400 rounded-lg shadow-sm" />
      )}
      {cards.length > 1 && (
        <div className="absolute top-0.5 left-0.5 w-16 h-24 bg-blue-550 border border-gray-400 rounded-lg shadow-sm" />
      )}

      {/* Top card */}
      <Card
        card={topCard}
        onClick={handleClick}
        size="small"
        className={cn(
          "relative z-10",
          "hover:translate-y-[-1px] transition-transform"
        )}
        data-testid="stock-top-card"
      />

      {/* Card count indicator */}
      {cards.length > 1 && (
        <div
          className={cn(
            "absolute -top-2 -right-2 z-20",
            "w-6 h-6 bg-blue-600 text-white text-xs font-bold",
            "rounded-full flex items-center justify-center",
            "border-2 border-white shadow-sm"
          )}
          aria-hidden="true"
        >
          {cards.length}
        </div>
      )}
    </section>
  );
};
