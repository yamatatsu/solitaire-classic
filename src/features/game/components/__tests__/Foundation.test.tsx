import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@/test/game-test-utils";
import type { Card } from "../../types";
import { Foundation } from "../Foundation";

describe("Foundation Component", () => {
  const mockFoundations: Card[][] = [
    [
      { suit: "hearts", rank: 1, faceUp: true, id: "hearts-1" },
      { suit: "hearts", rank: 2, faceUp: true, id: "hearts-2" },
    ],
    [{ suit: "diamonds", rank: 1, faceUp: true, id: "diamonds-1" }],
    [], // Empty clubs foundation
    [], // Empty spades foundation
  ];

  describe("Rendering", () => {
    it("should render all four foundation piles", () => {
      render(<Foundation foundations={mockFoundations} />);

      for (let i = 0; i < 4; i++) {
        expect(screen.getByTestId(`foundation-pile-${i}`)).toBeInTheDocument();
      }
    });

    it("should show top cards in non-empty foundations", () => {
      render(<Foundation foundations={mockFoundations} />);

      // Hearts foundation should show the 2 of hearts (top card)
      expect(screen.getByTestId("foundation-card-0")).toBeInTheDocument();

      // Diamonds foundation should show the ace of diamonds
      expect(screen.getByTestId("foundation-card-1")).toBeInTheDocument();
    });

    it("should show suit symbols for empty foundations", () => {
      render(<Foundation foundations={mockFoundations} />);

      // Empty foundations should show suit symbols
      const clubsPile = screen.getByTestId("foundation-pile-2");
      expect(clubsPile).toHaveTextContent("♣");
      expect(clubsPile).toHaveTextContent("clubs");

      const spadesPile = screen.getByTestId("foundation-pile-3");
      expect(spadesPile).toHaveTextContent("♠");
      expect(spadesPile).toHaveTextContent("spades");
    });

    it("should apply correct suit colors to empty foundations", () => {
      const emptyFoundations = [[], [], [], []];
      render(<Foundation foundations={emptyFoundations} />);

      // Hearts should be red
      const heartsPile = screen.getByTestId("foundation-pile-0");
      const heartsSymbol = heartsPile.querySelector(".text-red-300");
      expect(heartsSymbol).toBeInTheDocument();

      // Spades should be gray/black
      const spadesPile = screen.getByTestId("foundation-pile-3");
      const spadesSymbol = spadesPile.querySelector(".text-gray-600");
      expect(spadesSymbol).toBeInTheDocument();
    });

    it("should have proper accessibility attributes", () => {
      render(<Foundation foundations={mockFoundations} />);

      const foundation = screen.getByTestId("foundation");
      expect(foundation).toHaveAttribute("role", "region");
      expect(foundation).toHaveAttribute(
        "aria-label",
        "Foundation piles - build suits from Ace to King"
      );

      // Check pile accessibility
      const heartsPile = screen.getByTestId("foundation-pile-0");
      expect(heartsPile).toHaveAttribute("role", "button");
      expect(heartsPile).toHaveAttribute(
        "aria-label",
        "hearts foundation pile, 2 cards"
      );

      const emptyPile = screen.getByTestId("foundation-pile-2");
      expect(emptyPile).toHaveAttribute(
        "aria-label",
        "clubs foundation pile, 0 cards"
      );
    });
  });

  describe("Interactions", () => {
    it("should call onFoundationClick when empty foundation is clicked", () => {
      const onFoundationClick = vi.fn();
      render(
        <Foundation
          foundations={mockFoundations}
          onFoundationClick={onFoundationClick}
        />
      );

      const emptyPile = screen.getByTestId("foundation-pile-2");
      fireEvent.click(emptyPile);

      expect(onFoundationClick).toHaveBeenCalledWith(2);
    });

    it("should call onCardClick when foundation card is clicked", () => {
      const onCardClick = vi.fn();
      render(
        <Foundation foundations={mockFoundations} onCardClick={onCardClick} />
      );

      const foundationCard = screen.getByTestId("foundation-card-0");
      fireEvent.click(foundationCard);

      expect(onCardClick).toHaveBeenCalledWith("hearts-2", 0);
    });

    it("should not call onFoundationClick when card is clicked", () => {
      const onFoundationClick = vi.fn();
      const onCardClick = vi.fn();
      render(
        <Foundation
          foundations={mockFoundations}
          onFoundationClick={onFoundationClick}
          onCardClick={onCardClick}
        />
      );

      const foundationCard = screen.getByTestId("foundation-card-0");
      fireEvent.click(foundationCard);

      expect(onFoundationClick).not.toHaveBeenCalled();
      expect(onCardClick).toHaveBeenCalledWith("hearts-2", 0);
    });
  });

  describe("Card Display", () => {
    it("should show only the top card of each foundation", () => {
      render(<Foundation foundations={mockFoundations} />);

      // Hearts foundation has 2 cards, should only show the top one (2 of hearts)
      const heartsCards = screen.queryAllByTestId(/foundation-card-0/);
      expect(heartsCards).toHaveLength(1);

      // The displayed card should be the top card (hearts-2)
      const topCard = screen.getByTestId("foundation-card-0");
      expect(topCard).toHaveAttribute("data-suit", "hearts");
      expect(topCard).toHaveAttribute("data-rank", "2");
    });

    it("should position cards absolutely within piles", () => {
      render(<Foundation foundations={mockFoundations} />);

      const foundationCard = screen.getByTestId("foundation-card-0");
      expect(foundationCard).toHaveClass(
        "absolute",
        "inset-0",
        "w-full",
        "h-full"
      );
    });
  });

  describe("Responsive Design", () => {
    it("should use CSS Grid with 4 columns", () => {
      render(<Foundation foundations={mockFoundations} />);

      const foundation = screen.getByTestId("foundation");
      expect(foundation).toHaveClass("grid", "grid-cols-4");
    });

    it("should have responsive gap classes", () => {
      render(<Foundation foundations={mockFoundations} />);

      const foundation = screen.getByTestId("foundation");
      expect(foundation).toHaveClass("gap-2", "sm:gap-3", "md:gap-4");
    });

    it("should have minimum touch target sizes", () => {
      render(<Foundation foundations={mockFoundations} />);

      const pile = screen.getByTestId("foundation-pile-0");
      expect(pile).toHaveClass("min-h-[44px]", "min-w-[44px]");
    });

    it("should have maximum width constraint", () => {
      render(<Foundation foundations={mockFoundations} />);

      const foundation = screen.getByTestId("foundation");
      expect(foundation).toHaveClass("max-w-sm");
    });
  });

  describe("Suit Symbols", () => {
    it("should display correct suit symbols", () => {
      const emptyFoundations: Card[][] = [[], [], [], []];
      render(<Foundation foundations={emptyFoundations} />);

      expect(screen.getByText("♥")).toBeInTheDocument();
      expect(screen.getByText("♦")).toBeInTheDocument();
      expect(screen.getByText("♣")).toBeInTheDocument();
      expect(screen.getByText("♠")).toBeInTheDocument();
    });

    it("should display suit names", () => {
      const emptyFoundations: Card[][] = [[], [], [], []];
      render(<Foundation foundations={emptyFoundations} />);

      expect(screen.getByText("hearts")).toBeInTheDocument();
      expect(screen.getByText("diamonds")).toBeInTheDocument();
      expect(screen.getByText("clubs")).toBeInTheDocument();
      expect(screen.getByText("spades")).toBeInTheDocument();
    });
  });

  describe("Custom Props", () => {
    it("should apply custom className", () => {
      render(
        <Foundation
          foundations={mockFoundations}
          className="custom-foundation"
        />
      );

      const foundation = screen.getByTestId("foundation");
      expect(foundation).toHaveClass("custom-foundation");
    });

    it("should accept custom data-testid", () => {
      render(
        <Foundation
          foundations={mockFoundations}
          data-testid="custom-foundation"
        />
      );

      expect(screen.getByTestId("custom-foundation")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle all empty foundations", () => {
      const emptyFoundations: Card[][] = [[], [], [], []];
      render(<Foundation foundations={emptyFoundations} />);

      for (let i = 0; i < 4; i++) {
        const pile = screen.getByTestId(`foundation-pile-${i}`);
        expect(pile).toBeInTheDocument();
        expect(
          screen.queryByTestId(`foundation-card-${i}`)
        ).not.toBeInTheDocument();
      }
    });

    it("should handle missing foundations array", () => {
      const incompleteFoundations: Card[][] = [
        [{ suit: "hearts", rank: 1, faceUp: true, id: "hearts-1" }],
        [], // Only two foundations provided
      ];

      render(<Foundation foundations={incompleteFoundations} />);

      // Should still render all 4 piles, treating missing ones as empty
      for (let i = 0; i < 4; i++) {
        expect(screen.getByTestId(`foundation-pile-${i}`)).toBeInTheDocument();
      }
    });

    it("should handle foundations with single cards", () => {
      const singleCardFoundations: Card[][] = [
        [{ suit: "hearts", rank: 1, faceUp: true, id: "hearts-1" }],
        [{ suit: "diamonds", rank: 1, faceUp: true, id: "diamonds-1" }],
        [{ suit: "clubs", rank: 1, faceUp: true, id: "clubs-1" }],
        [{ suit: "spades", rank: 1, faceUp: true, id: "spades-1" }],
      ];

      const onCardClick = vi.fn();
      render(
        <Foundation
          foundations={singleCardFoundations}
          onCardClick={onCardClick}
        />
      );

      const heartsCard = screen.getByTestId("foundation-card-0");
      fireEvent.click(heartsCard);

      expect(onCardClick).toHaveBeenCalledWith("hearts-1", 0);
    });
  });
});
