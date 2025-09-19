import { act, renderHook } from "@testing-library/react";
import { Provider } from "jotai";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { Card } from "../../types";
import { useDragAndDrop } from "../useDragAndDrop";
import { useStockPile } from "../useStockPile";

// Test wrapper with Jotai Provider
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <Provider>{children}</Provider>
);

describe("Hooks Integration", () => {
  const createMockCard = (suit: string, rank: number, faceUp = false): Card => ({
    id: `${suit}-${rank}`,
    suit: suit as Card["suit"],
    rank: rank as Card["rank"],
    color: (suit === "hearts" || suit === "diamonds") ? "red" : "black",
    faceUp,
  });

  it("should work together for complete game interactions", () => {
    const mockOnCardMove = vi.fn();
    const mockOnCardFlip = vi.fn();
    const mockOnStockClick = vi.fn();

    const { result: dragResult } = renderHook(() => useDragAndDrop({
      onCardMove: mockOnCardMove,
      onCardFlip: mockOnCardFlip,
    }), {
      wrapper: TestWrapper,
    });

    const { result: stockResult } = renderHook(() => useStockPile({
      drawCount: 3,
      onStockClick: mockOnStockClick,
    }), {
      wrapper: TestWrapper,
    });

    // Both hooks should initialize properly
    expect(dragResult.current.dragState.isDragging).toBe(false);
    expect(stockResult.current.canDrawFromStock).toBe(false);

    // Should have all necessary handlers
    expect(typeof dragResult.current.dragHandlers.onDragStart).toBe("function");
    expect(typeof dragResult.current.touchHandlers.onTouchStart).toBe("function");
    expect(typeof stockResult.current.drawFromStock).toBe("function");
  });

  it("should handle drag and drop with stock pile interactions", () => {
    const mockOnCardMove = vi.fn();
    const mockOnStockClick = vi.fn();

    const { result: dragResult } = renderHook(() => useDragAndDrop({
      onCardMove: mockOnCardMove,
    }), {
      wrapper: TestWrapper,
    });

    const { result: stockResult } = renderHook(() => useStockPile({
      onStockClick: mockOnStockClick,
    }), {
      wrapper: TestWrapper,
    });

    // Test card creation and validation
    const testCard = createMockCard("hearts", 1, true);
    expect(testCard.color).toBe("red");
    expect(testCard.faceUp).toBe(true);

    // Test drag validation
    expect(dragResult.current.isValidDrop("foundation-0")).toBe(false); // No active drag

    // Start a drag operation
    const mockDataTransfer = {
      effectAllowed: "",
      setData: vi.fn(),
    };
    const mockEvent = {
      dataTransfer: mockDataTransfer,
      target: document.createElement("div"),
    } as unknown as DragEvent;

    act(() => {
      dragResult.current.dragHandlers.onDragStart(mockEvent, testCard, "waste", 0);
    });

    expect(dragResult.current.dragState.isDragging).toBe(true);

    // Test stock pile operations
    act(() => {
      stockResult.current.drawFromStock();
    });

    // Should not call callback when no cards available
    expect(mockOnStockClick).not.toHaveBeenCalled();
  });

  it("should handle touch events with proper performance", () => {
    const mockOnCardMove = vi.fn();
    const mockOnCardFlip = vi.fn();

    const { result } = renderHook(() => useDragAndDrop({
      onCardMove: mockOnCardMove,
      onCardFlip: mockOnCardFlip,
    }), {
      wrapper: TestWrapper,
    });

    const testCard = createMockCard("spades", 13, true); // King of Spades

    const mockTouchEvent = {
      touches: [{ clientX: 100, clientY: 200 }],
      target: document.createElement("div"),
    } as unknown as TouchEvent;

    const startTime = performance.now();

    act(() => {
      result.current.touchHandlers.onTouchStart(mockTouchEvent, testCard, "tableau-0", 0);
    });

    const endTime = performance.now();
    const responseTime = endTime - startTime;

    // Should respond within 100ms as per requirements
    expect(responseTime).toBeLessThan(100);
    expect(result.current.touchState.isTouching).toBe(true);
  });

  it("should maintain type safety across all interactions", () => {
    const { result: dragResult } = renderHook(() => useDragAndDrop(), {
      wrapper: TestWrapper,
    });

    const { result: stockResult } = renderHook(() => useStockPile(), {
      wrapper: TestWrapper,
    });

    // Type safety verification through structure
    expect(dragResult.current.dragState).toHaveProperty("isDragging");
    expect(dragResult.current.dragState).toHaveProperty("dragData");
    expect(dragResult.current.touchState).toHaveProperty("isTouching");

    expect(stockResult.current).toHaveProperty("stock");
    expect(stockResult.current).toHaveProperty("waste");
    expect(stockResult.current).toHaveProperty("canDrawFromStock");
    expect(stockResult.current).toHaveProperty("canRecycleStock");

    // Function signatures
    expect(dragResult.current.dragHandlers).toHaveProperty("onDragStart");
    expect(dragResult.current.dragHandlers).toHaveProperty("onDrop");
    expect(dragResult.current.touchHandlers).toHaveProperty("onTouchStart");
    expect(dragResult.current.touchHandlers).toHaveProperty("onTouchEnd");

    expect(stockResult.current).toHaveProperty("drawFromStock");
    expect(stockResult.current).toHaveProperty("recycleStock");
    expect(stockResult.current).toHaveProperty("getTopWasteCard");
    expect(stockResult.current).toHaveProperty("getDrawableCards");
  });
});