import { atom } from 'jotai';
import type { Card } from '../types';

// Initialize empty 7-column tableau
const initialTableau: Card[][] = Array.from({ length: 7 }, () => []);

// Base tableau atom
export const tableauAtom = atom<Card[][]>(initialTableau);

// Action to add a card to a specific column
export const addCardToTableauColumn = atom(
  null,
  (get, set, { columnIndex, card }: { columnIndex: number; card: Card }) => {
    if (columnIndex < 0 || columnIndex >= 7) {
      throw new Error(`Invalid column index: ${columnIndex}`);
    }

    const currentTableau = get(tableauAtom);
    const newTableau = currentTableau.map((column, index) => {
      if (index === columnIndex) {
        return [...column, card];
      }
      return column;
    });

    set(tableauAtom, newTableau);
  }
);

// Action to remove a card from a specific column
export const removeCardFromTableauColumn = atom(
  null,
  (get, set, { columnIndex, cardId }: { columnIndex: number; cardId?: string }) => {
    if (columnIndex < 0 || columnIndex >= 7) {
      throw new Error(`Invalid column index: ${columnIndex}`);
    }

    const currentTableau = get(tableauAtom);
    const column = currentTableau[columnIndex];

    if (column.length === 0) {
      throw new Error('Cannot remove card from empty column');
    }

    let newColumn: Card[];

    if (cardId) {
      // Remove specific card by ID
      const cardIndex = column.findIndex(card => card.id === cardId);
      if (cardIndex === -1) {
        throw new Error(`Card with id ${cardId} not found in column ${columnIndex}`);
      }
      newColumn = column.filter(card => card.id !== cardId);
    } else {
      // Remove last card
      newColumn = column.slice(0, -1);
    }

    const newTableau = currentTableau.map((col, index) => {
      if (index === columnIndex) {
        return newColumn;
      }
      return col;
    });

    set(tableauAtom, newTableau);
  }
);

// Action to flip a card in a specific column
export const flipCardInTableau = atom(
  null,
  (get, set, { columnIndex, cardId }: { columnIndex: number; cardId: string }) => {
    if (columnIndex < 0 || columnIndex >= 7) {
      throw new Error(`Invalid column index: ${columnIndex}`);
    }

    const currentTableau = get(tableauAtom);
    const column = currentTableau[columnIndex];
    const cardIndex = column.findIndex(card => card.id === cardId);

    if (cardIndex === -1) {
      throw new Error(`Card with id ${cardId} not found in column ${columnIndex}`);
    }

    const newTableau = currentTableau.map((col, colIndex) => {
      if (colIndex === columnIndex) {
        return col.map((card, cardIdx) => {
          if (cardIdx === cardIndex) {
            return { ...card, faceUp: !card.faceUp };
          }
          return card;
        });
      }
      return col;
    });

    set(tableauAtom, newTableau);
  }
);