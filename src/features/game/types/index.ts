// Game types and interfaces for solitaire

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
  id: string;
}

export interface GameState {
  tableau: Card[][];
  foundations: Card[][];
  stock: Card[];
  waste: Card[];
}

export interface MoveAction {
  type: 'MOVE_CARD' | 'FLIP_CARD' | 'DEAL_CARD' | 'RESET_STOCK';
  payload: {
    from?: string;
    to?: string;
    cardId?: string;
    cards?: Card[];
  };
}