import React from 'react';
import { cn } from '@/lib/utils';
import type { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  className?: string;
  draggable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  card,
  onClick,
  className,
  draggable = false,
}) => {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';

  const getSuitSymbol = (suit: CardType['suit']): string => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return '';
    }
  };

  const getRankDisplay = (rank: number): string => {
    switch (rank) {
      case 1: return 'A';
      case 11: return 'J';
      case 12: return 'Q';
      case 13: return 'K';
      default: return rank.toString();
    }
  };

  if (!card.faceUp) {
    return (
      <div
        className={cn(
          'w-16 h-24 bg-blue-600 border border-gray-400 rounded-lg cursor-pointer',
          'flex items-center justify-center text-white font-bold',
          className
        )}
        onClick={onClick}
        data-testid="card-back"
      >
        ?
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-16 h-24 bg-white border border-gray-400 rounded-lg cursor-pointer',
        'flex flex-col items-center justify-between p-1',
        isRed ? 'text-red-500' : 'text-black',
        className
      )}
      onClick={onClick}
      draggable={draggable}
      data-testid="card-face"
      data-suit={card.suit}
      data-rank={card.rank}
    >
      <div className="text-xs font-bold">
        {getRankDisplay(card.rank)}
      </div>
      <div className="text-2xl">
        {getSuitSymbol(card.suit)}
      </div>
      <div className="text-xs font-bold transform rotate-180">
        {getRankDisplay(card.rank)}
      </div>
    </div>
  );
};