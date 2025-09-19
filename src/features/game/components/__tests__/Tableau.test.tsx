import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/game-test-utils';
import { Tableau } from '../Tableau';
import type { Card } from '../../types';

describe('Tableau Component', () => {
  const mockColumns: Card[][] = [
    [
      { suit: 'hearts', rank: 7, faceUp: false, id: 'hearts-7' },
      { suit: 'spades', rank: 6, faceUp: true, id: 'spades-6' },
    ],
    [
      { suit: 'clubs', rank: 13, faceUp: false, id: 'clubs-13' },
      { suit: 'diamonds', rank: 12, faceUp: true, id: 'diamonds-12' },
    ],
    [], // Empty column
    [{ suit: 'hearts', rank: 1, faceUp: true, id: 'hearts-1' }],
    [],
    [],
    [],
  ];

  describe('Rendering', () => {
    it('should render all seven columns', () => {
      render(<Tableau columns={mockColumns} />);

      for (let i = 0; i < 7; i++) {
        expect(screen.getByTestId(`tableau-column-${i}`)).toBeInTheDocument();
      }
    });

    it('should render cards in correct columns', () => {
      render(<Tableau columns={mockColumns} />);

      // Column 0 should have 2 cards
      expect(screen.getByTestId('tableau-card-0-0')).toBeInTheDocument();
      expect(screen.getByTestId('tableau-card-0-1')).toBeInTheDocument();

      // Column 1 should have 2 cards
      expect(screen.getByTestId('tableau-card-1-0')).toBeInTheDocument();
      expect(screen.getByTestId('tableau-card-1-1')).toBeInTheDocument();

      // Column 3 should have 1 card
      expect(screen.getByTestId('tableau-card-3-0')).toBeInTheDocument();
    });

    it('should show empty state for empty columns', () => {
      render(<Tableau columns={mockColumns} />);

      // Columns 2, 4, 5, 6 should show "Empty"
      const emptyColumns = [2, 4, 5, 6];
      emptyColumns.forEach(columnIndex => {
        const column = screen.getByTestId(`tableau-column-${columnIndex}`);
        expect(column).toHaveTextContent('Empty');
      });
    });

    it('should apply correct accessibility attributes', () => {
      render(<Tableau columns={mockColumns} />);

      const tableau = screen.getByTestId('tableau');
      expect(tableau).toHaveAttribute('role', 'region');
      expect(tableau).toHaveAttribute('aria-label', 'Tableau - seven columns of cards');

      // Check column accessibility
      const firstColumn = screen.getByTestId('tableau-column-0');
      expect(firstColumn).toHaveAttribute('role', 'button');
      expect(firstColumn).toHaveAttribute('aria-label', 'Tableau column 1, 2 cards');
    });
  });

  describe('Card Interactions', () => {
    it('should call onCardClick when a card is clicked', () => {
      const onCardClick = vi.fn();
      render(<Tableau columns={mockColumns} onCardClick={onCardClick} />);

      const card = screen.getByTestId('tableau-card-0-1');
      fireEvent.click(card);

      expect(onCardClick).toHaveBeenCalledWith('spades-6', 0, 1);
    });

    it('should call onColumnClick when empty column is clicked', () => {
      const onColumnClick = vi.fn();
      render(<Tableau columns={mockColumns} onColumnClick={onColumnClick} />);

      const emptyColumn = screen.getByTestId('tableau-column-2');
      fireEvent.click(emptyColumn);

      expect(onColumnClick).toHaveBeenCalledWith(2);
    });

    it('should not call onColumnClick when card is clicked', () => {
      const onColumnClick = vi.fn();
      const onCardClick = vi.fn();
      render(
        <Tableau
          columns={mockColumns}
          onColumnClick={onColumnClick}
          onCardClick={onCardClick}
        />
      );

      const card = screen.getByTestId('tableau-card-0-1');
      fireEvent.click(card);

      expect(onColumnClick).not.toHaveBeenCalled();
      expect(onCardClick).toHaveBeenCalledWith('spades-6', 0, 1);
    });
  });

  describe('Card Stacking', () => {
    it('should make only the last card in each column draggable', () => {
      render(<Tableau columns={mockColumns} />);

      // First card in column 0 should not be draggable (face down)
      const firstCard = screen.getByTestId('tableau-card-0-0');
      expect(firstCard).toHaveAttribute('draggable', 'false');

      // Last card in column 0 should be draggable (face up)
      const lastCard = screen.getByTestId('tableau-card-0-1');
      expect(lastCard).toHaveAttribute('draggable', 'true');
    });

    it('should apply proper z-index for card stacking', () => {
      render(<Tableau columns={mockColumns} />);

      const column = screen.getByTestId('tableau-column-0');
      const cards = column.querySelectorAll('[data-testid^="tableau-card-0-"]');

      expect(cards).toHaveLength(2);
      // Cards should have increasing z-index values
      expect(cards[0].parentElement).toHaveStyle('z-index: 1');
      expect(cards[1].parentElement).toHaveStyle('z-index: 2');
    });
  });

  describe('Responsive Design', () => {
    it('should use CSS Grid with 7 columns', () => {
      render(<Tableau columns={mockColumns} />);

      const tableau = screen.getByTestId('tableau');
      expect(tableau).toHaveClass('grid', 'grid-cols-7');
    });

    it('should have responsive gap classes', () => {
      render(<Tableau columns={mockColumns} />);

      const tableau = screen.getByTestId('tableau');
      expect(tableau).toHaveClass('gap-2', 'sm:gap-3', 'md:gap-4');
    });

    it('should have minimum touch target sizes', () => {
      render(<Tableau columns={mockColumns} />);

      const emptyColumn = screen.getByTestId('tableau-column-2');
      expect(emptyColumn).toHaveClass('min-h-[44px]');
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      render(<Tableau columns={mockColumns} className="custom-tableau" />);

      const tableau = screen.getByTestId('tableau');
      expect(tableau).toHaveClass('custom-tableau');
    });

    it('should accept custom data-testid', () => {
      render(<Tableau columns={mockColumns} data-testid="custom-tableau" />);

      expect(screen.getByTestId('custom-tableau')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle all empty columns', () => {
      const emptyColumns: Card[][] = [[], [], [], [], [], [], []];
      render(<Tableau columns={emptyColumns} />);

      for (let i = 0; i < 7; i++) {
        const column = screen.getByTestId(`tableau-column-${i}`);
        expect(column).toHaveTextContent('Empty');
      }
    });

    it('should handle single card columns', () => {
      const singleCardColumns: Card[][] = [
        [{ suit: 'hearts', rank: 1, faceUp: true, id: 'hearts-1' }],
        [], [], [], [], [], []
      ];

      const onCardClick = vi.fn();
      render(<Tableau columns={singleCardColumns} onCardClick={onCardClick} />);

      const card = screen.getByTestId('tableau-card-0-0');
      fireEvent.click(card);

      expect(onCardClick).toHaveBeenCalledWith('hearts-1', 0, 0);
    });

    it('should handle columns with many cards', () => {
      const manyCardsColumn: Card[] = [];
      for (let i = 1; i <= 13; i++) {
        manyCardsColumn.push({
          suit: 'spades',
          rank: i as any,
          faceUp: i === 13, // Only last card face up
          id: `spades-${i}`,
        });
      }

      const columns: Card[][] = [manyCardsColumn, [], [], [], [], [], []];
      render(<Tableau columns={columns} />);

      // Should render all 13 cards
      for (let i = 0; i < 13; i++) {
        expect(screen.getByTestId(`tableau-card-0-${i}`)).toBeInTheDocument();
      }
    });
  });
});