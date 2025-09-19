import type React from "react";
import { cn } from "@/lib/utils";
import type { Card as CardType } from "../types";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  className?: string;
  draggable?: boolean;
  size?: "small" | "medium" | "large";
  "data-testid"?: string;
}

export const Card: React.FC<CardProps> = ({
  card,
  onClick,
  className,
  draggable = false,
  size = "medium",
  "data-testid": testId,
}) => {
  const isRed = card.suit === "hearts" || card.suit === "diamonds";

  const getSuitSymbol = (suit: CardType["suit"]): string => {
    switch (suit) {
      case "hearts":
        return "♥";
      case "diamonds":
        return "♦";
      case "clubs":
        return "♣";
      case "spades":
        return "♠";
      default:
        return "";
    }
  };

  const getRankDisplay = (rank: number): string => {
    switch (rank) {
      case 1:
        return "A";
      case 11:
        return "J";
      case 12:
        return "Q";
      case 13:
        return "K";
      default:
        return rank.toString();
    }
  };

  // Size variants for responsive design
  const sizeClasses = {
    small: "w-12 h-16 text-xs min-h-[44px] min-w-[44px]", // Mobile optimized
    medium: "w-16 h-24 text-sm min-h-[44px] min-w-[44px]", // Default
    large: "w-20 h-30 text-base min-h-[44px] min-w-[44px]", // Desktop large
  };

  const textSizes = {
    small: { rank: "text-xs", suit: "text-sm" },
    medium: { rank: "text-xs", suit: "text-2xl" },
    large: { rank: "text-sm", suit: "text-3xl" },
  };

  if (!card.faceUp) {
    return (
      <div
        className={cn(
          sizeClasses[size],
          "bg-blue-600 border border-gray-400 rounded-lg cursor-pointer",
          "flex items-center justify-center text-white font-bold",
          "shadow-md hover:shadow-lg transition-shadow",
          "touch-manipulation select-none",
          className
        )}
        onClick={onClick}
        role="button"
        tabIndex={onClick ? 0 : -1}
        data-testid={testId || "card-back"}
        aria-label={`Face down card, ${card.id}`}
      >
        <span className={textSizes[size].suit}>?</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        sizeClasses[size],
        "bg-white border border-gray-400 rounded-lg cursor-pointer",
        "flex flex-col items-center justify-between p-1",
        "shadow-md hover:shadow-lg transition-shadow",
        "touch-manipulation select-none",
        isRed ? "text-red-500" : "text-black",
        className
      )}
      onClick={onClick}
      draggable={draggable}
      role="button"
      tabIndex={onClick ? 0 : -1}
      data-testid={testId || "card-face"}
      data-suit={card.suit}
      data-rank={card.rank}
      aria-label={`${getRankDisplay(card.rank)} of ${card.suit}, ${card.id}`}
    >
      <div className={cn(textSizes[size].rank, "font-bold")}>
        {getRankDisplay(card.rank)}
      </div>
      <div className={textSizes[size].suit}>{getSuitSymbol(card.suit)}</div>
      <div
        className={cn(textSizes[size].rank, "font-bold transform rotate-180")}
      >
        {getRankDisplay(card.rank)}
      </div>
    </div>
  );
};
