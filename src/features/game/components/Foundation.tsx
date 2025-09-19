import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import type { Card as CardType, Suit } from '../types';

interface FoundationProps {
  foundations: CardType[][];
  onFoundationClick?: (foundationIndex: number) => void;
  onCardClick?: (cardId: string, foundationIndex: number) => void;
  className?: string;
  'data-testid'?: string;
}

export const Foundation: React.FC<FoundationProps> = ({
  foundations,
  onFoundationClick,
  onCardClick,
  className,
  'data-testid': testId,
}) => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

  const getSuitSymbol = (suit: Suit): string => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
    }
  };

  const getSuitColor = (suit: Suit): string => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-300' : 'text-gray-600';
  };

  const handleFoundationClick = (foundationIndex: number, event: React.MouseEvent) => {
    // Only trigger foundation click if the click wasn't on a card
    if ((event.target as HTMLElement).closest('[data-testid^="foundation-card-"]')) {
      return;
    }
    onFoundationClick?.(foundationIndex);
  };

  const handleCardClick = (cardId: string, foundationIndex: number) => {
    onCardClick?.(cardId, foundationIndex);
  };

  return (
    <div
      className={cn(
        'grid grid-cols-4 gap-2 w-full max-w-sm',
        'sm:gap-3 md:gap-4',
        className
      )}
      data-testid={testId || "foundation"}
      role="region"
      aria-label="Foundation piles - build suits from Ace to King"
    >
      {suits.map((suit, foundationIndex) => {
        const pile = foundations[foundationIndex] || [];
        const topCard = pile[pile.length - 1];

        return (
          <div
            key={suit}
            className={cn(
              'relative flex items-center justify-center',
              'w-16 h-24 min-h-[44px] min-w-[44px]', // Ensure touch targets
              'bg-white border-2 border-dashed border-gray-300 rounded-lg',
              'hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer',
              'shadow-sm'
            )}
            onClick={(event) => handleFoundationClick(foundationIndex, event)}
            data-testid={`foundation-pile-${foundationIndex}`}
            role="button"
            tabIndex={0}
            aria-label={`${suit} foundation pile, ${pile.length} cards`}
          >
            {topCard ? (
              <Card
                card={topCard}
                onClick={() => handleCardClick(topCard.id, foundationIndex)}
                size="small"
                className="absolute inset-0 w-full h-full"
                data-testid={`foundation-card-${foundationIndex}`}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-2">
                <div className={cn(
                  'text-4xl mb-1',
                  getSuitColor(suit)
                )}>
                  {getSuitSymbol(suit)}
                </div>
                <div className="text-xs text-gray-400 font-medium uppercase">
                  {suit}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};