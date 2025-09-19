import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/game-test-utils';
import { Card } from '../Card';
import type { Card as CardType } from '../../types';

describe('Card Component', () => {
  const mockCard: CardType = {
    suit: 'hearts',
    rank: 7,
    faceUp: true,
    id: 'hearts-7',
  };

  describe('Face Up Card', () => {
    it('should render face up card correctly', () => {
      render(<Card card={mockCard} />);

      const cardElement = screen.getByTestId('card-face');
      expect(cardElement).toBeInTheDocument();
      expect(cardElement).toHaveAttribute('data-suit', 'hearts');
      expect(cardElement).toHaveAttribute('data-rank', '7');
    });

    it('should display correct rank for number cards', () => {
      render(<Card card={mockCard} />);

      expect(screen.getAllByText('7')).toHaveLength(2); // Appears twice on card
    });

    it('should display correct rank for face cards', () => {
      const kingCard: CardType = {
        suit: 'spades',
        rank: 13,
        faceUp: true,
        id: 'spades-13',
      };

      render(<Card card={kingCard} />);

      expect(screen.getAllByText('K')).toHaveLength(2);
    });

    it('should display correct rank for Ace', () => {
      const aceCard: CardType = {
        suit: 'clubs',
        rank: 1,
        faceUp: true,
        id: 'clubs-1',
      };

      render(<Card card={aceCard} />);

      expect(screen.getAllByText('A')).toHaveLength(2);
    });

    it('should display correct suit symbol for hearts', () => {
      render(<Card card={mockCard} />);

      expect(screen.getByText('♥')).toBeInTheDocument();
    });

    it('should display correct suit symbol for diamonds', () => {
      const diamondCard: CardType = {
        suit: 'diamonds',
        rank: 5,
        faceUp: true,
        id: 'diamonds-5',
      };

      render(<Card card={diamondCard} />);

      expect(screen.getByText('♦')).toBeInTheDocument();
    });

    it('should display correct suit symbol for clubs', () => {
      const clubCard: CardType = {
        suit: 'clubs',
        rank: 10,
        faceUp: true,
        id: 'clubs-10',
      };

      render(<Card card={clubCard} />);

      expect(screen.getByText('♣')).toBeInTheDocument();
    });

    it('should display correct suit symbol for spades', () => {
      const spadeCard: CardType = {
        suit: 'spades',
        rank: 12,
        faceUp: true,
        id: 'spades-12',
      };

      render(<Card card={spadeCard} />);

      expect(screen.getByText('♠')).toBeInTheDocument();
    });

    it('should have red color for hearts and diamonds', () => {
      const { rerender } = render(<Card card={mockCard} />);

      let cardElement = screen.getByTestId('card-face');
      expect(cardElement).toHaveClass('text-red-500');

      const diamondCard: CardType = {
        suit: 'diamonds',
        rank: 3,
        faceUp: true,
        id: 'diamonds-3',
      };

      rerender(<Card card={diamondCard} />);

      cardElement = screen.getByTestId('card-face');
      expect(cardElement).toHaveClass('text-red-500');
    });

    it('should have black color for clubs and spades', () => {
      const blackCard: CardType = {
        suit: 'clubs',
        rank: 8,
        faceUp: true,
        id: 'clubs-8',
      };

      const { rerender } = render(<Card card={blackCard} />);

      let cardElement = screen.getByTestId('card-face');
      expect(cardElement).toHaveClass('text-black');

      const spadeCard: CardType = {
        suit: 'spades',
        rank: 9,
        faceUp: true,
        id: 'spades-9',
      };

      rerender(<Card card={spadeCard} />);

      cardElement = screen.getByTestId('card-face');
      expect(cardElement).toHaveClass('text-black');
    });
  });

  describe('Face Down Card', () => {
    it('should render face down card correctly', () => {
      const faceDownCard: CardType = {
        ...mockCard,
        faceUp: false,
      };

      render(<Card card={faceDownCard} />);

      const cardElement = screen.getByTestId('card-back');
      expect(cardElement).toBeInTheDocument();
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('should not show rank or suit for face down card', () => {
      const faceDownCard: CardType = {
        ...mockCard,
        faceUp: false,
      };

      render(<Card card={faceDownCard} />);

      expect(screen.queryByText('7')).not.toBeInTheDocument();
      expect(screen.queryByText('♥')).not.toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', () => {
      const onClickMock = vi.fn();

      render(<Card card={mockCard} onClick={onClickMock} />);

      const cardElement = screen.getByTestId('card-face');
      fireEvent.click(cardElement);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });

    it('should apply custom className', () => {
      const customClass = 'custom-card-style';

      render(<Card card={mockCard} className={customClass} />);

      const cardElement = screen.getByTestId('card-face');
      expect(cardElement).toHaveClass(customClass);
    });

    it('should be draggable when draggable prop is true', () => {
      render(<Card card={mockCard} draggable={true} />);

      const cardElement = screen.getByTestId('card-face');
      expect(cardElement).toHaveAttribute('draggable', 'true');
    });

    it('should not be draggable by default', () => {
      render(<Card card={mockCard} />);

      const cardElement = screen.getByTestId('card-face');
      expect(cardElement).toHaveAttribute('draggable', 'false');
    });
  });
});