import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import type { Card as CardType } from '../types';

interface TableauProps {
  columns: CardType[][];
  onCardClick?: (cardId: string, columnIndex: number, cardIndex: number) => void;
  onColumnClick?: (columnIndex: number) => void;
  className?: string;
  'data-testid'?: string;
}

export const Tableau: React.FC<TableauProps> = ({
  columns,
  onCardClick,
  onColumnClick,
  className,
  'data-testid': testId,
}) => {
  const handleCardClick = (cardId: string, columnIndex: number, cardIndex: number) => {
    onCardClick?.(cardId, columnIndex, cardIndex);
  };

  const handleColumnClick = (columnIndex: number, event: React.MouseEvent) => {
    // Only trigger column click if the click wasn't on a card
    if ((event.target as HTMLElement).closest('[data-testid^="tableau-card-"]')) {
      return;
    }
    onColumnClick?.(columnIndex);
  };

  return (
    <div
      className={cn(
        'grid grid-cols-7 gap-2 w-full',
        'sm:gap-3 md:gap-4',
        className
      )}
      data-testid={testId || "tableau"}
      role="region"
      aria-label="Tableau - seven columns of cards"
    >
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={cn(
            'flex flex-col min-h-[120px] relative',
            'bg-green-100 border-2 border-dashed border-green-300 rounded-lg',
            'hover:bg-green-50 transition-colors cursor-pointer',
            'p-1 min-h-[44px]' // Ensure touch target
          )}
          onClick={(event) => handleColumnClick(columnIndex, event)}
          data-testid={`tableau-column-${columnIndex}`}
          role="button"
          tabIndex={0}
          aria-label={`Tableau column ${columnIndex + 1}, ${column.length} cards`}
        >
          {column.length === 0 ? (
            <div className="flex items-center justify-center h-20 text-green-400 text-sm font-medium">
              Empty
            </div>
          ) : (
            <div className="flex flex-col">
              {column.map((card, cardIndex) => {
                const isLastCard = cardIndex === column.length - 1;
                const marginTop = cardIndex === 0 ? 0 : -16; // Overlap cards

                return (
                  <div
                    key={card.id}
                    className="relative"
                    style={{
                      marginTop: cardIndex === 0 ? 0 : marginTop,
                      zIndex: cardIndex + 1
                    }}
                  >
                    <Card
                      card={card}
                      onClick={() => handleCardClick(card.id, columnIndex, cardIndex)}
                      size="small"
                      className={cn(
                        'transition-transform hover:scale-105',
                        isLastCard && 'hover:translate-y-[-2px]',
                        // Make sure draggable cards are above others
                        card.faceUp && isLastCard && 'relative z-10'
                      )}
                      draggable={card.faceUp && isLastCard}
                      data-testid={`tableau-card-${columnIndex}-${cardIndex}`}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};