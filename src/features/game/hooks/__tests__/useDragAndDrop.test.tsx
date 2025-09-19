import { act, renderHook } from "@testing-library/react";
import { Provider } from "jotai";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Card } from "../../types";
import { useDragAndDrop } from "../useDragAndDrop";

// Mock navigator.vibrate
const mockVibrate = vi.fn();
Object.defineProperty(navigator, "vibrate", {
  value: mockVibrate,
  writable: true,
});

// Test wrapper with Jotai Provider
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <Provider>{children}</Provider>
);

describe("useDragAndDrop", () => {
  let mockOnCardMove: ReturnType<typeof vi.fn>;
  let mockOnCardFlip: ReturnType<typeof vi.fn>;

  const mockCard: Card = {
    id: "hearts-1",
    suit: "hearts",
    rank: 1,
    faceUp: true,
  };

  beforeEach(() => {
    mockOnCardMove = vi.fn();
    mockOnCardFlip = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it("should initialize with empty drag and touch states", () => {
    const { result } = renderHook(() => useDragAndDrop(), {
      wrapper: TestWrapper,
    });

    expect(result.current.dragState.isDragging).toBe(false);
    expect(result.current.dragState.dragData).toBe(null);
    expect(result.current.dragState.dropTarget).toBe(null);
    expect(result.current.touchState.isTouching).toBe(false);
    expect(result.current.touchState.touchData).toBe(null);
  });

  describe("HTML5 Drag and Drop", () => {
    it("should handle drag start correctly", () => {
      const { result } = renderHook(
        () => useDragAndDrop({ onCardMove: mockOnCardMove }),
        {
          wrapper: TestWrapper,
        }
      );

      const mockDataTransfer = {
        effectAllowed: "",
        setData: vi.fn(),
      };

      const mockEvent = {
        dataTransfer: mockDataTransfer,
        target: document.createElement("div"),
      } as unknown as DragEvent;

      act(() => {
        result.current.dragHandlers.onDragStart(
          mockEvent,
          mockCard,
          "tableau-0",
          0
        );
      });

      expect(result.current.dragState.isDragging).toBe(true);
      expect(result.current.dragState.dragData).toEqual({
        card: mockCard,
        sourceLocation: "tableau-0",
        sourceIndex: 0,
      });
      expect(mockDataTransfer.effectAllowed).toBe("move");
      expect(mockDataTransfer.setData).toHaveBeenCalledWith(
        "application/json",
        JSON.stringify({
          card: mockCard,
          sourceLocation: "tableau-0",
          sourceIndex: 0,
        })
      );
    });

    it("should handle drag end correctly", () => {
      const { result } = renderHook(() => useDragAndDrop(), {
        wrapper: TestWrapper,
      });

      // First start a drag
      const mockDataTransfer = {
        effectAllowed: "",
        setData: vi.fn(),
      };
      const mockDragEvent = {
        dataTransfer: mockDataTransfer,
        target: document.createElement("div"),
      } as unknown as DragEvent;

      act(() => {
        result.current.dragHandlers.onDragStart(
          mockDragEvent,
          mockCard,
          "tableau-0",
          0
        );
      });

      expect(result.current.dragState.isDragging).toBe(true);

      // Then end the drag
      const mockEndEvent = {} as DragEvent;
      act(() => {
        result.current.dragHandlers.onDragEnd(mockEndEvent);
      });

      expect(result.current.dragState.isDragging).toBe(false);
      expect(result.current.dragState.dragData).toBe(null);
    });

    it("should handle drag over with correct effects", () => {
      const { result } = renderHook(() => useDragAndDrop(), {
        wrapper: TestWrapper,
      });

      const mockEvent = {
        preventDefault: vi.fn(),
        dataTransfer: { dropEffect: "" },
      } as unknown as DragEvent;

      result.current.dragHandlers.onDragOver(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.dataTransfer?.dropEffect).toBe("move");
    });

    it("should handle drop when drag is active and drop is valid", () => {
      const { result } = renderHook(
        () => useDragAndDrop({ onCardMove: mockOnCardMove }),
        {
          wrapper: TestWrapper,
        }
      );

      // Start drag first
      const mockDataTransfer = {
        effectAllowed: "",
        setData: vi.fn(),
      };
      const mockDragEvent = {
        dataTransfer: mockDataTransfer,
        target: document.createElement("div"),
      } as unknown as DragEvent;

      act(() => {
        result.current.dragHandlers.onDragStart(
          mockDragEvent,
          mockCard,
          "tableau-0",
          0
        );
      });

      // Mock isValidDrop to return true
      vi.spyOn(result.current, "isValidDrop").mockReturnValue(true);

      const mockDropEvent = {
        preventDefault: vi.fn(),
      } as unknown as DragEvent;

      act(() => {
        result.current.dragHandlers.onDrop(mockDropEvent, "foundation-0");
      });

      expect(mockDropEvent.preventDefault).toHaveBeenCalled();
      expect(mockOnCardMove).toHaveBeenCalledWith(
        {
          card: mockCard,
          sourceLocation: "tableau-0",
          sourceIndex: 0,
        },
        {
          location: "foundation-0",
          isValid: true,
        }
      );
      expect(result.current.dragState.isDragging).toBe(false);
    });
  });

  describe("Touch Events", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should handle touch start and initiate long press detection", () => {
      const { result } = renderHook(
        () => useDragAndDrop({ onCardMove: mockOnCardMove }),
        {
          wrapper: TestWrapper,
        }
      );

      const mockTouchEvent = {
        touches: [{ clientX: 100, clientY: 200 }],
        target: document.createElement("div"),
      } as unknown as TouchEvent;

      act(() => {
        result.current.touchHandlers.onTouchStart(
          mockTouchEvent,
          mockCard,
          "tableau-0",
          0
        );
      });

      expect(result.current.touchState.isTouching).toBe(true);
      expect(result.current.touchState.touchData).toEqual({
        startX: 100,
        startY: 200,
        currentX: 100,
        currentY: 200,
        element: mockTouchEvent.target,
        timestamp: expect.any(Number),
      });
    });

    it("should initiate drag after long press timeout", () => {
      const { result } = renderHook(
        () => useDragAndDrop({ onCardMove: mockOnCardMove }),
        {
          wrapper: TestWrapper,
        }
      );

      const mockTouchEvent = {
        touches: [{ clientX: 100, clientY: 200 }],
        target: document.createElement("div"),
      } as unknown as TouchEvent;

      act(() => {
        result.current.touchHandlers.onTouchStart(
          mockTouchEvent,
          mockCard,
          "tableau-0",
          0
        );
      });

      expect(result.current.dragState.isDragging).toBe(false);

      // Fast forward past long press threshold
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.dragState.isDragging).toBe(true);
      expect(result.current.dragState.dragData).toEqual({
        card: mockCard,
        sourceLocation: "tableau-0",
        sourceIndex: 0,
      });
      expect(mockVibrate).toHaveBeenCalledWith(50);
    });

    it("should cancel long press if touch moves too much", () => {
      const { result } = renderHook(
        () => useDragAndDrop({ onCardMove: mockOnCardMove }),
        {
          wrapper: TestWrapper,
        }
      );

      const mockTouchStartEvent = {
        touches: [{ clientX: 100, clientY: 200 }],
        target: document.createElement("div"),
      } as unknown as TouchEvent;

      act(() => {
        result.current.touchHandlers.onTouchStart(
          mockTouchStartEvent,
          mockCard,
          "tableau-0",
          0
        );
      });

      // Move touch beyond threshold
      const mockTouchMoveEvent = {
        touches: [{ clientX: 120, clientY: 220 }], // 20+ pixel movement
      } as unknown as TouchEvent;

      act(() => {
        result.current.touchHandlers.onTouchMove(mockTouchMoveEvent);
      });

      // Fast forward past long press threshold
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should not have initiated drag
      expect(result.current.dragState.isDragging).toBe(false);
    });

    it("should handle touch end and execute card move for drag operations", () => {
      const { result } = renderHook(
        () => useDragAndDrop({ onCardMove: mockOnCardMove }),
        {
          wrapper: TestWrapper,
        }
      );

      const mockTouchEvent = {
        touches: [{ clientX: 100, clientY: 200 }],
        target: document.createElement("div"),
      } as unknown as TouchEvent;

      // Start touch and wait for long press
      act(() => {
        result.current.touchHandlers.onTouchStart(
          mockTouchEvent,
          mockCard,
          "tableau-0",
          0
        );
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Simulate a valid drop target
      act(() => {
        result.current.dragState.dropTarget = {
          location: "foundation-0",
          isValid: true,
        };
      });

      const mockTouchEndEvent = {} as TouchEvent;

      act(() => {
        result.current.touchHandlers.onTouchEnd(mockTouchEndEvent);
      });

      expect(mockOnCardMove).toHaveBeenCalled();
      expect(result.current.dragState.isDragging).toBe(false);
      expect(result.current.touchState.isTouching).toBe(false);
    });

    it("should handle touch end as card flip for tap operations", () => {
      const { result } = renderHook(
        () => useDragAndDrop({ onCardFlip: mockOnCardFlip }),
        {
          wrapper: TestWrapper,
        }
      );

      const mockElement = document.createElement("div");
      mockElement.setAttribute("data-location", "tableau-0");
      mockElement.setAttribute("data-index", "2");

      const mockTouchEvent = {
        touches: [{ clientX: 100, clientY: 200 }],
        target: mockElement,
      } as unknown as TouchEvent;

      // Start touch
      act(() => {
        result.current.touchHandlers.onTouchStart(
          mockTouchEvent,
          mockCard,
          "tableau-0",
          2
        );
      });

      // End touch quickly (no long press)
      const mockTouchEndEvent = {} as TouchEvent;

      act(() => {
        result.current.touchHandlers.onTouchEnd(mockTouchEndEvent);
      });

      expect(mockOnCardFlip).toHaveBeenCalledWith("tableau-0", 2);
      expect(result.current.touchState.isTouching).toBe(false);
    });
  });

  describe("isValidDrop", () => {
    it("should return false when not dragging", () => {
      const { result } = renderHook(() => useDragAndDrop(), {
        wrapper: TestWrapper,
      });

      expect(result.current.isValidDrop("foundation-0")).toBe(false);
    });

    it("should return false for same location drop", () => {
      const { result } = renderHook(() => useDragAndDrop(), {
        wrapper: TestWrapper,
      });

      // Start drag
      const mockDataTransfer = {
        effectAllowed: "",
        setData: vi.fn(),
      };
      const mockEvent = {
        dataTransfer: mockDataTransfer,
        target: document.createElement("div"),
      } as unknown as DragEvent;

      act(() => {
        result.current.dragHandlers.onDragStart(
          mockEvent,
          mockCard,
          "tableau-0",
          0
        );
      });

      expect(result.current.isValidDrop("tableau-0")).toBe(false);
    });

    it("should return false for invalid locations like stock and waste", () => {
      const { result } = renderHook(() => useDragAndDrop(), {
        wrapper: TestWrapper,
      });

      // Start drag
      const mockDataTransfer = {
        effectAllowed: "",
        setData: vi.fn(),
      };
      const mockEvent = {
        dataTransfer: mockDataTransfer,
        target: document.createElement("div"),
      } as unknown as DragEvent;

      act(() => {
        result.current.dragHandlers.onDragStart(
          mockEvent,
          mockCard,
          "tableau-0",
          0
        );
      });

      expect(result.current.isValidDrop("stock")).toBe(false);
      expect(result.current.isValidDrop("waste")).toBe(false);
    });
  });

  describe("Performance", () => {
    it("should respond to drag start within performance threshold", () => {
      const { result } = renderHook(
        () => useDragAndDrop({ onCardMove: mockOnCardMove }),
        {
          wrapper: TestWrapper,
        }
      );

      const mockDataTransfer = {
        effectAllowed: "",
        setData: vi.fn(),
      };
      const mockEvent = {
        dataTransfer: mockDataTransfer,
        target: document.createElement("div"),
      } as unknown as DragEvent;

      const startTime = performance.now();

      act(() => {
        result.current.dragHandlers.onDragStart(
          mockEvent,
          mockCard,
          "tableau-0",
          0
        );
      });

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Should respond within 100ms as per requirements
      expect(responseTime).toBeLessThan(100);
      expect(result.current.dragState.isDragging).toBe(true);
    });

    it("should respond to touch start within performance threshold", () => {
      const { result } = renderHook(
        () => useDragAndDrop({ onCardMove: mockOnCardMove }),
        {
          wrapper: TestWrapper,
        }
      );

      const mockTouchEvent = {
        touches: [{ clientX: 100, clientY: 200 }],
        target: document.createElement("div"),
      } as unknown as TouchEvent;

      const startTime = performance.now();

      act(() => {
        result.current.touchHandlers.onTouchStart(
          mockTouchEvent,
          mockCard,
          "tableau-0",
          0
        );
      });

      const endTime = performance.now();
      const responseTime = endTime - startTime;

      // Should respond within 100ms as per requirements
      expect(responseTime).toBeLessThan(100);
      expect(result.current.touchState.isTouching).toBe(true);
    });
  });
});
