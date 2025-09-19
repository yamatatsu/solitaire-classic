import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/game-test-utils';
import { GameBoard } from '../GameBoard';
import type { GameState } from '../../types';

describe('GameBoard Component', () => {
  const mockGameState: GameState = {
    tableau: [
      [
        { suit: 'hearts', rank: 7, faceUp: false, id: 'hearts-7' },
        { suit: 'spades', rank: 6, faceUp: true, id: 'spades-6' },
      ],
      [{ suit: 'clubs', rank: 13, faceUp: true, id: 'clubs-13' }],
      [], [], [], [], []
    ],
    foundations: [
      [{ suit: 'hearts', rank: 1, faceUp: true, id: 'hearts-1' }],
      [],
      [],
      []
    ],
    stock: [
      { suit: 'diamonds', rank: 10, faceUp: false, id: 'diamonds-10' },
      { suit: 'clubs', rank: 9, faceUp: false, id: 'clubs-9' },
    ],
    waste: [
      { suit: 'spades', rank: 8, faceUp: true, id: 'spades-8' },
      { suit: 'hearts', rank: 5, faceUp: true, id: 'hearts-5' },
    ]
  };

  describe('Rendering', () => {
    it('should render all game areas', () => {
      render(<GameBoard gameState={mockGameState} />);

      expect(screen.getByTestId('game-board')).toBeInTheDocument();
      expect(screen.getByTestId('game-foundation')).toBeInTheDocument();
      expect(screen.getByTestId('game-stock')).toBeInTheDocument();
      expect(screen.getByTestId('game-waste')).toBeInTheDocument();
      expect(screen.getByTestId('game-tableau')).toBeInTheDocument();
    });

    it('should render section headers', () => {
      render(<GameBoard gameState={mockGameState} />);

      expect(screen.getByText('Foundation')).toBeInTheDocument();
      expect(screen.getByText('Stock & Waste')).toBeInTheDocument();
      expect(screen.getByText('Tableau')).toBeInTheDocument();
      expect(screen.getByText('Stock')).toBeInTheDocument();
      expect(screen.getByText('Waste')).toBeInTheDocument();
    });

    it('should display game statistics in footer', () => {
      render(<GameBoard gameState={mockGameState} />);

      expect(screen.getByText('Stock: 2')).toBeInTheDocument();
      expect(screen.getByText('Waste: 2')).toBeInTheDocument();
      expect(screen.getByText('Foundations: 1')).toBeInTheDocument();
      expect(screen.getByText('Tableau: 3')).toBeInTheDocument();
    });

    it('should have proper accessibility attributes', () => {
      render(<GameBoard gameState={mockGameState} />);

      const gameBoard = screen.getByTestId('game-board');
      expect(gameBoard).toHaveAttribute('role', 'main');
      expect(gameBoard).toHaveAttribute('aria-label', 'Solitaire Game Board');
    });

    it('should have green felt background', () => {
      render(<GameBoard gameState={mockGameState} />);

      const gameBoard = screen.getByTestId('game-board');
      expect(gameBoard).toHaveClass('bg-green-600');
    });
  });

  describe('Layout and Responsive Design', () => {
    it('should use flexbox layout with proper spacing', () => {
      render(<GameBoard gameState={mockGameState} />);

      const gameBoard = screen.getByTestId('game-board');
      expect(gameBoard).toHaveClass(
        'w-full',
        'min-h-screen',
        'flex',
        'flex-col',
        'gap-6'
      );
    });

    it('should have responsive padding', () => {
      render(<GameBoard gameState={mockGameState} />);

      const gameBoard = screen.getByTestId('game-board');
      expect(gameBoard).toHaveClass('p-4', 'sm:p-6', 'md:p-8');
    });

    it('should support minimum width', () => {
      render(<GameBoard gameState={mockGameState} />);

      const gameBoard = screen.getByTestId('game-board');
      expect(gameBoard).toHaveClass('min-w-[320px]');
    });

    it('should have responsive top area layout', () => {
      render(<GameBoard gameState={mockGameState} />);

      const topArea = screen.getByTestId('game-board').firstElementChild;
      expect(topArea).toHaveClass(
        'flex',
        'flex-col',
        'sm:flex-row',
        'justify-between'
      );
    });

    it('should center tableau with max width constraint', () => {
      render(<GameBoard gameState={mockGameState} />);

      const tableauContainer = screen.getByTestId('game-tableau').parentElement?.parentElement;
      expect(tableauContainer).toHaveClass('flex', 'justify-center');

      const tableauWrapper = screen.getByTestId('game-tableau').parentElement;
      expect(tableauWrapper).toHaveClass('w-full', 'max-w-4xl');
    });
  });

  describe('Tableau Interactions', () => {
    it('should call onTableauCardClick when tableau card is clicked', () => {
      const onTableauCardClick = vi.fn();
      render(<GameBoard gameState={mockGameState} onTableauCardClick={onTableauCardClick} />);

      // Find a tableau card and click it
      const tableauCard = screen.getByTestId('tableau-card-0-1');
      fireEvent.click(tableauCard);

      expect(onTableauCardClick).toHaveBeenCalledWith('spades-6', 0, 1);
    });

    it('should call onTableauColumnClick when tableau column is clicked', () => {
      const onTableauColumnClick = vi.fn();
      render(<GameBoard gameState={mockGameState} onTableauColumnClick={onTableauColumnClick} />);

      // Click on an empty tableau column
      const emptyColumn = screen.getByTestId('tableau-column-2');
      fireEvent.click(emptyColumn);

      expect(onTableauColumnClick).toHaveBeenCalledWith(2);
    });
  });

  describe('Foundation Interactions', () => {
    it('should call onFoundationClick when foundation pile is clicked', () => {
      const onFoundationClick = vi.fn();
      render(<GameBoard gameState={mockGameState} onFoundationClick={onFoundationClick} />);

      // Click on an empty foundation pile
      const emptyFoundation = screen.getByTestId('foundation-pile-1');
      fireEvent.click(emptyFoundation);

      expect(onFoundationClick).toHaveBeenCalledWith(1);
    });

    it('should call onFoundationCardClick when foundation card is clicked', () => {
      const onFoundationCardClick = vi.fn();
      render(<GameBoard gameState={mockGameState} onFoundationCardClick={onFoundationCardClick} />);

      // Click on a foundation card
      const foundationCard = screen.getByTestId('foundation-card-0');
      fireEvent.click(foundationCard);

      expect(onFoundationCardClick).toHaveBeenCalledWith('hearts-1', 0);
    });
  });

  describe('Stock and Waste Interactions', () => {
    it('should call onStockClick when stock is clicked', () => {
      const onStockClick = vi.fn();
      render(<GameBoard gameState={mockGameState} onStockClick={onStockClick} />);

      const stockCard = screen.getByTestId('stock-top-card');
      fireEvent.click(stockCard);

      expect(onStockClick).toHaveBeenCalledTimes(1);
    });

    it('should call onWasteClick when waste area is clicked', () => {
      const onWasteClick = vi.fn();
      render(<GameBoard gameState={mockGameState} onWasteClick={onWasteClick} />);

      const wasteArea = screen.getByTestId('game-waste');
      fireEvent.click(wasteArea);

      expect(onWasteClick).toHaveBeenCalledTimes(1);
    });

    it('should call onWasteCardClick when waste card is clicked', () => {
      const onWasteCardClick = vi.fn();
      render(<GameBoard gameState={mockGameState} onWasteCardClick={onWasteCardClick} />);

      const wasteCard = screen.getByTestId('waste-card-1');
      fireEvent.click(wasteCard);

      expect(onWasteCardClick).toHaveBeenCalledWith('hearts-5', 1);
    });
  });

  describe('Game Statistics', () => {
    it('should calculate and display correct card counts', () => {
      render(<GameBoard gameState={mockGameState} />);

      // Stock: 2 cards
      expect(screen.getByText('Stock: 2')).toBeInTheDocument();

      // Waste: 2 cards
      expect(screen.getByText('Waste: 2')).toBeInTheDocument();

      // Foundations: 1 card total (1 in hearts, 0 in others)
      expect(screen.getByText('Foundations: 1')).toBeInTheDocument();

      // Tableau: 3 cards total (2 in column 0, 1 in column 1)
      expect(screen.getByText('Tableau: 3')).toBeInTheDocument();
    });

    it('should update counts when game state changes', () => {
      const newGameState: GameState = {
        ...mockGameState,
        stock: [],
        waste: [],
        foundations: [
          [
            { suit: 'hearts', rank: 1, faceUp: true, id: 'hearts-1' },
            { suit: 'hearts', rank: 2, faceUp: true, id: 'hearts-2' },
          ],
          [],
          [],
          []
        ]
      };

      const { rerender } = render(<GameBoard gameState={mockGameState} />);

      rerender(<GameBoard gameState={newGameState} />);

      expect(screen.getByText('Stock: 0')).toBeInTheDocument();
      expect(screen.getByText('Waste: 0')).toBeInTheDocument();
      expect(screen.getByText('Foundations: 2')).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('should apply custom className', () => {
      render(<GameBoard gameState={mockGameState} className="custom-board" />);

      const gameBoard = screen.getByTestId('game-board');
      expect(gameBoard).toHaveClass('custom-board');
    });

    it('should accept custom data-testid', () => {
      render(<GameBoard gameState={mockGameState} data-testid="custom-board" />);

      expect(screen.getByTestId('custom-board')).toBeInTheDocument();
    });

    it('should handle missing callback props gracefully', () => {
      expect(() => {
        render(<GameBoard gameState={mockGameState} />);

        // Try to trigger various interactions
        const tableauCard = screen.getByTestId('tableau-card-0-1');
        fireEvent.click(tableauCard);

        const foundationPile = screen.getByTestId('foundation-pile-1');
        fireEvent.click(foundationPile);

        const stockCard = screen.getByTestId('stock-top-card');
        fireEvent.click(stockCard);
      }).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle completely empty game state', () => {
      const emptyGameState: GameState = {
        tableau: [[], [], [], [], [], [], []],
        foundations: [[], [], [], []],
        stock: [],
        waste: []
      };

      render(<GameBoard gameState={emptyGameState} />);

      expect(screen.getByText('Stock: 0')).toBeInTheDocument();
      expect(screen.getByText('Waste: 0')).toBeInTheDocument();
      expect(screen.getByText('Foundations: 0')).toBeInTheDocument();
      expect(screen.getByText('Tableau: 0')).toBeInTheDocument();
    });

    it('should handle game state with all cards in foundations', () => {
      const fullFoundations: GameState = {
        tableau: [[], [], [], [], [], [], []],
        foundations: [
          Array.from({ length: 13 }, (_, i) => ({
            suit: 'hearts' as const,
            rank: (i + 1) as any,
            faceUp: true,
            id: `hearts-${i + 1}`
          })),
          Array.from({ length: 13 }, (_, i) => ({
            suit: 'diamonds' as const,
            rank: (i + 1) as any,
            faceUp: true,
            id: `diamonds-${i + 1}`
          })),
          Array.from({ length: 13 }, (_, i) => ({
            suit: 'clubs' as const,
            rank: (i + 1) as any,
            faceUp: true,
            id: `clubs-${i + 1}`
          })),
          Array.from({ length: 13 }, (_, i) => ({
            suit: 'spades' as const,
            rank: (i + 1) as any,
            faceUp: true,
            id: `spades-${i + 1}`
          })),
        ],
        stock: [],
        waste: []
      };

      render(<GameBoard gameState={fullFoundations} />);

      expect(screen.getByText('Foundations: 52')).toBeInTheDocument();
    });

    it('should handle very long tableau columns', () => {
      const longColumns: GameState = {
        ...mockGameState,
        tableau: [
          Array.from({ length: 20 }, (_, i) => ({
            suit: 'hearts' as const,
            rank: ((i % 13) + 1) as any,
            faceUp: i === 19, // Only last card face up
            id: `hearts-${i}`
          })),
          [], [], [], [], [], []
        ]
      };

      render(<GameBoard gameState={longColumns} />);

      expect(screen.getByText('Tableau: 20')).toBeInTheDocument();
    });
  });
});