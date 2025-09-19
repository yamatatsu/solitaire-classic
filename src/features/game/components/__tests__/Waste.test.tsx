import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/game-test-utils';
import { Waste } from '../Waste';
import type { Card } from '../../types';

describe('Waste Component', () => {
  const mockCards: Card[] = [
    { suit: 'hearts', rank: 7, faceUp: true, id: 'hearts-7' },
    { suit: 'spades', rank: 6, faceUp: true, id: 'spades-6' },
    { suit: 'clubs', rank: 5, faceUp: true, id: 'clubs-5' },
    { suit: 'diamonds', rank: 4, faceUp: true, id: 'diamonds-4' },
    { suit: 'hearts', rank: 3, faceUp: true, id: 'hearts-3' },
  ];

  describe('Rendering with Cards', () => {
    it('should render waste with cards', () => {
      render(<Waste cards={mockCards} />);

      expect(screen.getByTestId('waste')).toBeInTheDocument();
    });

    it('should show only the last 3 cards by default', () => {
      render(<Waste cards={mockCards} />);

      // Should show cards at indices 2, 3, 4 (last 3 cards)
      expect(screen.getByTestId('waste-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('waste-card-3')).toBeInTheDocument();
      expect(screen.getByTestId('waste-card-4')).toBeInTheDocument();

      // Should not show earlier cards
      expect(screen.queryByTestId('waste-card-0')).not.toBeInTheDocument();
      expect(screen.queryByTestId('waste-card-1')).not.toBeInTheDocument();
    });

    it('should respect custom maxVisible prop', () => {
      render(<Waste cards={mockCards} maxVisible={2} />);

      // Should only show last 2 cards
      expect(screen.getByTestId('waste-card-3')).toBeInTheDocument();
      expect(screen.getByTestId('waste-card-4')).toBeInTheDocument();

      // Should not show earlier cards
      expect(screen.queryByTestId('waste-card-2')).not.toBeInTheDocument();
    });

    it('should show card count indicator when there are more cards than visible', () => {
      render(<Waste cards={mockCards} />);

      const countIndicator = screen.getByRole('generic', { hidden: true });
      expect(countIndicator).toHaveTextContent('5');
      expect(countIndicator).toHaveClass('bg-orange-600');
    });

    it('should not show count indicator when all cards are visible', () => {
      const fewCards = mockCards.slice(0, 2);
      render(<Waste cards={fewCards} />);

      expect(screen.queryByText('2')).not.toBeInTheDocument();
    });

    it('should apply proper left offset for card layering', () => {
      render(<Waste cards={mockCards} />);

      const wasteArea = screen.getByTestId('waste');
      const cardElements = wasteArea.querySelectorAll('[data-testid^="waste-card-"]');

      // Each card should have increasing left offset
      expect(cardElements[0]).toHaveStyle('left: 0px');
      expect(cardElements[1]).toHaveStyle('left: 6px');
      expect(cardElements[2]).toHaveStyle('left: 12px');
    });
  });

  describe('Rendering Empty Waste', () => {
    it('should render empty waste correctly', () => {
      render(<Waste cards={[]} />);

      expect(screen.getByTestId('waste-empty')).toBeInTheDocument();
      expect(screen.getByText('Waste')).toBeInTheDocument();
    });

    it('should have proper accessibility for empty waste', () => {
      render(<Waste cards={[]} />);

      const emptyWaste = screen.getByTestId('waste-empty');
      expect(emptyWaste).toHaveAttribute('role', 'button');
      expect(emptyWaste).toHaveAttribute('aria-label', 'Empty waste pile');
      expect(emptyWaste).toHaveAttribute('tabIndex', '0');
    });

    it('should have minimum touch target sizes for empty waste', () => {
      render(<Waste cards={[]} />);

      const emptyWaste = screen.getByTestId('waste-empty');
      expect(emptyWaste).toHaveClass('min-h-[44px]', 'min-w-[44px]');
    });
  });

  describe('Card Interactions', () => {
    it('should call onCardClick when a visible card is clicked', () => {
      const onCardClick = vi.fn();
      render(<Waste cards={mockCards} onCardClick={onCardClick} />);

      const topCard = screen.getByTestId('waste-card-4');
      fireEvent.click(topCard);

      expect(onCardClick).toHaveBeenCalledWith('hearts-3', 4);
    });

    it('should calculate correct card index for onCardClick', () => {
      const onCardClick = vi.fn();
      render(<Waste cards={mockCards} maxVisible={2} onCardClick={onCardClick} />);

      const secondVisibleCard = screen.getByTestId('waste-card-3');
      fireEvent.click(secondVisibleCard);

      expect(onCardClick).toHaveBeenCalledWith('diamonds-4', 3);
    });

    it('should call onWasteClick when waste area is clicked outside cards', () => {
      const onWasteClick = vi.fn();
      render(<Waste cards={mockCards} onWasteClick={onWasteClick} />);

      const wasteArea = screen.getByTestId('waste');
      fireEvent.click(wasteArea);

      expect(onWasteClick).toHaveBeenCalledTimes(1);
    });

    it('should call onWasteClick when empty waste is clicked', () => {
      const onWasteClick = vi.fn();
      render(<Waste cards={[]} onWasteClick={onWasteClick} />);

      const emptyWaste = screen.getByTestId('waste-empty');
      fireEvent.click(emptyWaste);

      expect(onWasteClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onWasteClick when card is clicked', () => {
      const onWasteClick = vi.fn();
      const onCardClick = vi.fn();
      render(
        <Waste
          cards={mockCards}
          onWasteClick={onWasteClick}
          onCardClick={onCardClick}
        />
      );

      const topCard = screen.getByTestId('waste-card-4');
      fireEvent.click(topCard);

      expect(onWasteClick).not.toHaveBeenCalled();
      expect(onCardClick).toHaveBeenCalled();
    });
  });

  describe('Card Display Properties', () => {
    it('should render all visible cards as face up', () => {
      const faceDownCards = mockCards.map(card => ({ ...card, faceUp: false }));
      render(<Waste cards={faceDownCards} />);

      // All visible waste cards should be face up regardless of original faceUp value
      const cardElements = screen.getAllByTestId(/waste-card-/);
      cardElements.forEach(card => {
        expect(card).toHaveAttribute('data-testid', expect.stringMatching(/waste-card-/));
        expect(card).toHaveAttribute('data-testid', expect.not.stringMatching(/card-back/));
      });
    });

    it('should make only the top card draggable', () => {
      render(<Waste cards={mockCards} />);

      const topCard = screen.getByTestId('waste-card-4');
      expect(topCard).toHaveAttribute('draggable', 'true');

      const lowerCard = screen.getByTestId('waste-card-3');
      expect(lowerCard).toHaveAttribute('draggable', 'false');
    });

    it('should apply hover effects only to top card', () => {
      render(<Waste cards={mockCards} />);

      const topCard = screen.getByTestId('waste-card-4');
      expect(topCard).toHaveClass('hover:scale-105', 'hover:translate-y-[-2px]', 'cursor-pointer');

      const lowerCard = screen.getByTestId('waste-card-3');
      expect(lowerCard).toHaveClass('cursor-default');
      expect(lowerCard).not.toHaveClass('hover:scale-105');
    });

    it('should render cards with small size', () => {
      render(<Waste cards={mockCards} />);

      const topCard = screen.getByTestId('waste-card-4');
      expect(topCard).toHaveClass('w-12', 'h-16');
    });
  });

  describe('Z-Index and Layering', () => {
    it('should apply increasing z-index to cards', () => {
      render(<Waste cards={mockCards} />);

      const wasteArea = screen.getByTestId('waste');
      const cardContainers = wasteArea.querySelectorAll('.absolute');

      expect(cardContainers[0]).toHaveStyle('z-index: 1');
      expect(cardContainers[1]).toHaveStyle('z-index: 2');
      expect(cardContainers[2]).toHaveStyle('z-index: 3');
    });

    it('should position cards with correct left offsets', () => {
      render(<Waste cards={mockCards} />);

      const wasteArea = screen.getByTestId('waste');
      const cardContainers = wasteArea.querySelectorAll('.absolute');

      expect(cardContainers[0]).toHaveStyle('left: 0px');
      expect(cardContainers[1]).toHaveStyle('left: 6px');
      expect(cardContainers[2]).toHaveStyle('left: 12px');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-label with card counts', () => {
      render(<Waste cards={mockCards} />);

      const waste = screen.getByTestId('waste');
      expect(waste).toHaveAttribute('aria-label', 'Waste pile with 5 cards, showing top 3');
    });

    it('should update aria-label with custom maxVisible', () => {
      render(<Waste cards={mockCards} maxVisible={2} />);

      const waste = screen.getByTestId('waste');
      expect(waste).toHaveAttribute('aria-label', 'Waste pile with 5 cards, showing top 2');
    });

    it('should have region role for waste area', () => {
      render(<Waste cards={mockCards} />);

      const waste = screen.getByTestId('waste');
      expect(waste).toHaveAttribute('role', 'region');
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      render(<Waste cards={mockCards} className="custom-waste" />);

      const waste = screen.getByTestId('waste');
      expect(waste).toHaveClass('custom-waste');
    });

    it('should accept custom data-testid', () => {
      render(<Waste cards={mockCards} data-testid="custom-waste" />);

      expect(screen.getByTestId('custom-waste')).toBeInTheDocument();
    });

    it('should accept custom data-testid for empty waste', () => {
      render(<Waste cards={[]} data-testid="custom-empty-waste" />);

      expect(screen.getByTestId('custom-empty-waste')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single card', () => {
      const singleCard = [mockCards[0]];
      render(<Waste cards={singleCard} />);

      expect(screen.getByTestId('waste-card-0')).toBeInTheDocument();
      expect(screen.queryByRole('generic', { hidden: true })).not.toBeInTheDocument(); // No count indicator
    });

    it('should handle more cards than maxVisible', () => {
      const manyCards: Card[] = [];
      for (let i = 1; i <= 10; i++) {
        manyCards.push({
          suit: 'hearts',
          rank: (i % 13) + 1 as any,
          faceUp: true,
          id: `hearts-${i}`,
        });
      }

      render(<Waste cards={manyCards} maxVisible={3} />);

      // Should show only last 3 cards
      expect(screen.getByTestId('waste-card-7')).toBeInTheDocument();
      expect(screen.getByTestId('waste-card-8')).toBeInTheDocument();
      expect(screen.getByTestId('waste-card-9')).toBeInTheDocument();

      // Should show count indicator
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should handle exactly maxVisible cards', () => {
      const exactCards = mockCards.slice(0, 3);
      render(<Waste cards={exactCards} maxVisible={3} />);

      expect(screen.getByTestId('waste-card-0')).toBeInTheDocument();
      expect(screen.getByTestId('waste-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('waste-card-2')).toBeInTheDocument();

      // No count indicator since all cards are visible
      expect(screen.queryByText('3')).not.toBeInTheDocument();
    });

    it('should handle cards with duplicate IDs gracefully', () => {
      const duplicateCards: Card[] = [
        { suit: 'hearts', rank: 7, faceUp: true, id: 'duplicate' },
        { suit: 'spades', rank: 6, faceUp: true, id: 'duplicate' },
      ];

      render(<Waste cards={duplicateCards} />);

      // Should render both cards even with duplicate IDs
      const cardElements = screen.getAllByTestId(/waste-card-/);
      expect(cardElements).toHaveLength(2);
    });
  });
});