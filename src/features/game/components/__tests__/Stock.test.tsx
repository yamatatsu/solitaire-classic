import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@/test/game-test-utils";
import type { Card, Rank } from "../../types";
import { Stock } from "../Stock";

describe("Stock Component", () => {
  const mockCards: Card[] = [
    { suit: "hearts", rank: 7, faceUp: false, id: "hearts-7" },
    { suit: "spades", rank: 6, faceUp: false, id: "spades-6" },
    { suit: "clubs", rank: 5, faceUp: false, id: "clubs-5" },
  ];

  describe("Rendering with Cards", () => {
    it("should render stock with cards", () => {
      render(<Stock cards={mockCards} />);

      expect(screen.getByTestId("stock")).toBeInTheDocument();
      expect(screen.getByTestId("stock-top-card")).toBeInTheDocument();
    });

    it("should show the top card", () => {
      render(<Stock cards={mockCards} />);

      const topCard = screen.getByTestId("stock-top-card");
      expect(topCard).toHaveAttribute("data-suit", "clubs");
      expect(topCard).toHaveAttribute("data-rank", "5");
    });

    it("should show card count indicator for multiple cards", () => {
      render(<Stock cards={mockCards} />);

      const countIndicator = screen.getByText("3");
      expect(countIndicator).toBeInTheDocument();
    });

    it("should not show count indicator for single card", () => {
      const singleCard = [mockCards[0]];
      render(<Stock cards={singleCard} />);

      expect(screen.queryByText("1")).not.toBeInTheDocument();
    });

    it("should show layered card backgrounds for depth indication", () => {
      render(<Stock cards={mockCards} />);

      const stockElement = screen.getByTestId("stock");

      // Should have multiple background layers
      const layers = stockElement.querySelectorAll(".absolute");
      expect(layers.length).toBeGreaterThan(1);
    });

    it("should show proper aria-label with card count", () => {
      render(<Stock cards={mockCards} />);

      const stock = screen.getByTestId("stock");
      expect(stock).toHaveAttribute("aria-label", "Stock pile with 3 cards");
    });
  });

  describe("Rendering Empty Stock", () => {
    it("should render empty stock correctly", () => {
      render(<Stock cards={[]} />);

      expect(screen.getByTestId("stock-empty")).toBeInTheDocument();
      expect(screen.getByText("Reset")).toBeInTheDocument();
      expect(screen.getByText("↻")).toBeInTheDocument();
    });

    it("should have proper accessibility for empty stock", () => {
      render(<Stock cards={[]} />);

      const emptyStock = screen.getByTestId("stock-empty");
      expect(emptyStock).toHaveAttribute("role", "button");
      expect(emptyStock).toHaveAttribute(
        "aria-label",
        "Empty stock pile - click to reset from waste"
      );
      expect(emptyStock).toHaveAttribute("tabIndex", "0");
    });

    it("should apply hover styles to empty stock", () => {
      render(<Stock cards={[]} />);

      const emptyStock = screen.getByTestId("stock-empty");
      expect(emptyStock).toHaveClass(
        "hover:border-gray-400",
        "hover:bg-gray-200"
      );
    });
  });

  describe("Interactions", () => {
    it("should call onStockClick when stock with cards is clicked", () => {
      const onStockClick = vi.fn();
      render(<Stock cards={mockCards} onStockClick={onStockClick} />);

      const topCard = screen.getByTestId("stock-top-card");
      fireEvent.click(topCard);

      expect(onStockClick).toHaveBeenCalledTimes(1);
    });

    it("should call onStockClick when empty stock is clicked", () => {
      const onStockClick = vi.fn();
      render(<Stock cards={[]} onStockClick={onStockClick} />);

      const emptyStock = screen.getByTestId("stock-empty");
      fireEvent.click(emptyStock);

      expect(onStockClick).toHaveBeenCalledTimes(1);
    });

    it("should handle missing onStockClick prop gracefully", () => {
      expect(() => {
        render(<Stock cards={mockCards} />);
        const topCard = screen.getByTestId("stock-top-card");
        fireEvent.click(topCard);
      }).not.toThrow();
    });
  });

  describe("Card Display Properties", () => {
    it("should render top card with small size", () => {
      render(<Stock cards={mockCards} />);

      const topCard = screen.getByTestId("stock-top-card");
      // Check that it's using small size (can't easily test props, but can test resulting classes)
      expect(topCard).toHaveClass("w-12", "h-16");
    });

    it("should show face-down cards", () => {
      render(<Stock cards={mockCards} />);

      // All stock cards should be face down, so we should see the card back
      expect(screen.getByTestId("card-back")).toBeInTheDocument();
    });

    it("should apply hover transform to top card", () => {
      render(<Stock cards={mockCards} />);

      const topCard = screen.getByTestId("stock-top-card");
      expect(topCard).toHaveClass(
        "hover:translate-y-[-1px]",
        "transition-transform"
      );
    });
  });

  describe("Visual Stack Effect", () => {
    it("should not show background layers for single card", () => {
      const singleCard = [mockCards[0]];
      render(<Stock cards={singleCard} />);

      const stockElement = screen.getByTestId("stock");
      const backgroundLayers = stockElement.querySelectorAll(
        ".absolute:not([data-testid])"
      );
      expect(backgroundLayers).toHaveLength(0);
    });

    it("should show one background layer for two cards", () => {
      const twoCards = mockCards.slice(0, 2);
      render(<Stock cards={twoCards} />);

      const stockElement = screen.getByTestId("stock");
      const backgroundLayers = stockElement.querySelectorAll(
        ".absolute:not([data-testid])"
      );
      expect(backgroundLayers).toHaveLength(1);
    });

    it("should show two background layers for three or more cards", () => {
      render(<Stock cards={mockCards} />);

      const stockElement = screen.getByTestId("stock");
      const backgroundLayers = stockElement.querySelectorAll(
        ".absolute:not([data-testid])"
      );
      expect(backgroundLayers).toHaveLength(2);
    });
  });

  describe("Responsive Design", () => {
    it("should have minimum touch target sizes", () => {
      render(<Stock cards={[]} />);

      const emptyStock = screen.getByTestId("stock-empty");
      expect(emptyStock).toHaveClass("min-h-[44px]", "min-w-[44px]");
    });

    it("should have proper cursor styles", () => {
      const { rerender } = render(<Stock cards={mockCards} />);
      const topCard = screen.getByTestId("stock-top-card");
      expect(topCard).toHaveClass("cursor-pointer");

      rerender(<Stock cards={[]} />);
      const emptyStock = screen.getByTestId("stock-empty");
      expect(emptyStock).toHaveClass("cursor-pointer");
    });
  });

  describe("Custom Props", () => {
    it("should apply custom className", () => {
      render(<Stock cards={mockCards} className="custom-stock" />);

      const stock = screen.getByTestId("stock");
      expect(stock).toHaveClass("custom-stock");
    });

    it("should accept custom data-testid", () => {
      render(<Stock cards={mockCards} data-testid="custom-stock" />);

      expect(screen.getByTestId("custom-stock")).toBeInTheDocument();
    });

    it("should accept custom data-testid for empty stock", () => {
      render(<Stock cards={[]} data-testid="custom-empty-stock" />);

      expect(screen.getByTestId("custom-empty-stock")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty cards array", () => {
      render(<Stock cards={[]} />);

      expect(screen.getByTestId("stock-empty")).toBeInTheDocument();
      expect(screen.queryByTestId("stock")).not.toBeInTheDocument();
    });

    it("should handle large number of cards", () => {
      const manyCards: Card[] = [];
      for (let i = 1; i <= 24; i++) {
        manyCards.push({
          suit: "hearts",
          rank: ((i % 13) + 1) as Rank,
          faceUp: false,
          id: `hearts-${i}`,
        });
      }

      render(<Stock cards={manyCards} />);

      expect(screen.getByText("24")).toBeInTheDocument();
      expect(screen.getByTestId("stock")).toBeInTheDocument();
    });

    it("should show correct top card even with many cards", () => {
      const manyCards: Card[] = [
        { suit: "hearts", rank: 1, faceUp: false, id: "hearts-1" },
        { suit: "spades", rank: 2, faceUp: false, id: "spades-2" },
        { suit: "clubs", rank: 13, faceUp: false, id: "clubs-13" }, // This should be the top card
      ];

      render(<Stock cards={manyCards} />);

      const topCard = screen.getByTestId("stock-top-card");
      expect(topCard).toHaveAttribute("data-suit", "clubs");
      expect(topCard).toHaveAttribute("data-rank", "13");
    });
  });
});
