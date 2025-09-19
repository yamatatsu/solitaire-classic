import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import type { Card as CardType } from '../types';

interface WasteProps {
  cards: CardType[];
  onCardClick?: (cardId: string, cardIndex: number) => void;
  onWasteClick?: () => void;
  maxVisible?: number;
  className?: string;
  'data-testid'?: string;
}

export const Waste: React.FC<WasteProps> = ({
  cards,
  onCardClick,
  onWasteClick,
  maxVisible = 3,
  className,
  'data-testid': testId,
}) => {
  const hasCards = cards.length > 0;

  // Get the visible cards (last maxVisible cards)
  const visibleCards = cards.slice(-maxVisible);
  const topCardIndex = cards.length - 1;

  const handleCardClick = (cardId: string, visibleIndex: number) => {
    // Calculate the actual card index in the full cards array
    const actualIndex = Math.max(0, cards.length - maxVisible) + visibleIndex;
    onCardClick?.(cardId, actualIndex);
  };

  const handleWasteClick = (event: React.MouseEvent) => {
    // Only trigger waste click if the click wasn't on a card
    if ((event.target as HTMLElement).closest('[data-testid^="waste-card-"]')) {
      return;
    }
    onWasteClick?.();
  };

  if (!hasCards) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center',
          'w-16 h-24 min-h-[44px] min-w-[44px]', // Ensure touch targets
          'bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg',
          'hover:border-gray-400 hover:bg-gray-100 transition-all cursor-pointer',
          'shadow-sm'
        )}
        onClick={handleWasteClick}
        data-testid={testId || "waste-empty"}
        role="button"
        tabIndex={0}
        aria-label="Empty waste pile"
      >
        <div className="flex items-center justify-center p-2">
          <div className="text-xs text-gray-400 font-medium">
            Waste
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative w-20 h-24',
        className
      )}
      onClick={handleWasteClick}
      data-testid={testId || "waste"}
      role="region"
      aria-label={`Waste pile with ${cards.length} cards, showing top ${visibleCards.length}`}
    >
      {visibleCards.map((card, visibleIndex) => {
        const isTopCard = visibleIndex === visibleCards.length - 1;
        const actualIndex = Math.max(0, cards.length - maxVisible) + visibleIndex;

        // Offset cards to show layering effect
        const leftOffset = visibleIndex * 6; // 6px offset between cards
        const zIndex = visibleIndex + 1;

        return (
          <div
            key={`${card.id}-${actualIndex}`}
            className="absolute"
            style={{
              left: `${leftOffset}px`,
              zIndex: zIndex
            }}
          >
            <Card
              card={{
                ...card,
                faceUp: true // All waste cards should be face up
              }}
              onClick={() => handleCardClick(card.id, visibleIndex)}
              size="small"
              className={cn(
                'transition-transform',
                isTopCard && 'hover:scale-105 hover:translate-y-[-2px] cursor-pointer',
                !isTopCard && 'cursor-default'
              )}
              draggable={isTopCard}
              data-testid={`waste-card-${actualIndex}`}
            />
          </div>
        );
      })}

      {/* Card count indicator for large piles */}
      {cards.length > maxVisible && (
        <div
          className={cn(
            'absolute -top-2 -right-2 z-20',
            'w-6 h-6 bg-orange-600 text-white text-xs font-bold',
            'rounded-full flex items-center justify-center',
            'border-2 border-white shadow-sm'
          )}
          aria-hidden="true"
        >
          {cards.length}
        </div>
      )}
    </div>
  );
};