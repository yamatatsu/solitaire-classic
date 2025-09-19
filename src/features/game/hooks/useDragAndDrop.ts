import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import type { Card, DragData, DropTarget, TouchData } from "../types";
import {
  dragStateAtom,
  endDragAtom,
  endTouchAtom,
  setDragPreviewAtom,
  setTouchTargetAtom,
  startDragAtom,
  startTouchAtom,
  touchStateAtom,
  updateDropTargetAtom,
  updateTouchAtom,
} from "../stores";
import {
  isValidFoundationMove,
  isValidTableauMove,
  isValidTableauToFoundation,
  isValidTableauToTableau,
  isValidWasteToFoundation,
  isValidWasteToTableau,
} from "../utils/move-validation";
import { parseGameLocation } from "../utils";

interface UseDragAndDropProps {
  onCardMove?: (
    dragData: DragData,
    dropTarget: DropTarget
  ) => void;
  onCardFlip?: (location: string, cardIndex: number) => void;
}

interface DragHandlers {
  onDragStart: (event: DragEvent, card: Card, location: string, index: number) => void;
  onDragEnd: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
  onDrop: (event: DragEvent, location: string, index?: number) => void;
}

interface TouchHandlers {
  onTouchStart: (event: TouchEvent, card: Card, location: string, index: number) => void;
  onTouchMove: (event: TouchEvent) => void;
  onTouchEnd: (event: TouchEvent) => void;
}

export interface UseDragAndDropReturn {
  dragState: ReturnType<typeof useAtom<typeof dragStateAtom>>[0];
  touchState: ReturnType<typeof useAtom<typeof touchStateAtom>>[0];
  dragHandlers: DragHandlers;
  touchHandlers: TouchHandlers;
  isValidDrop: (location: string, index?: number) => boolean;
}

/**
 * Custom hook for handling drag and drop interactions with HTML5 API and touch fallbacks
 * Provides seamless cross-device gameplay with proper mobile support
 */
export const useDragAndDrop = ({
  onCardMove,
  onCardFlip,
}: UseDragAndDropProps = {}): UseDragAndDropReturn => {
  const [dragState] = useAtom(dragStateAtom);
  const [touchState] = useAtom(touchStateAtom);
  const [, startDrag] = useAtom(startDragAtom);
  const [, endDrag] = useAtom(endDragAtom);
  const [, updateDropTarget] = useAtom(updateDropTargetAtom);
  const [, setDragPreview] = useAtom(setDragPreviewAtom);
  const [, startTouch] = useAtom(startTouchAtom);
  const [, updateTouch] = useAtom(updateTouchAtom);
  const [, endTouch] = useAtom(endTouchAtom);
  const [, setTouchTarget] = useAtom(setTouchTargetAtom);

  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressRef = useRef<boolean>(false);

  // Validate drop location based on game rules
  const isValidDrop = useCallback(
    (location: string, index?: number): boolean => {
      if (!dragState.isDragging || !dragState.dragData) {
        return false;
      }

      const { card, cards, sourceLocation } = dragState.dragData;
      const targetLocation = parseGameLocation(location);

      // Can't drop on the same location
      if (location === sourceLocation) {
        return false;
      }

      // Validate based on target location type
      switch (targetLocation.type) {
        case "foundation": {
          // Only single cards can go to foundation
          if (cards && cards.length > 1) {
            return false;
          }
          // Use foundation validation
          return isValidFoundationMove(card, []); // Foundation pile would be passed from context
        }

        case "tableau": {
          const cardsToMove = cards || [card];
          // Use tableau validation
          return isValidTableauMove(cardsToMove, []); // Target column would be passed from context
        }

        case "waste":
        case "stock":
          // Can't drop cards back to stock or waste
          return false;

        default:
          return false;
      }
    },
    [dragState.isDragging, dragState.dragData]
  );

  // HTML5 Drag and Drop Handlers
  const onDragStart = useCallback(
    (event: DragEvent, card: Card, location: string, index: number) => {
      if (!event.dataTransfer) return;

      const dragData: DragData = {
        card,
        sourceLocation: location,
        sourceIndex: index,
      };

      // Set drag effect
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("application/json", JSON.stringify(dragData));

      // Create drag preview
      const target = event.target as HTMLElement;
      if (target) {
        setDragPreview(target.cloneNode(true) as HTMLElement);
      }

      startDrag(dragData);
    },
    [startDrag, setDragPreview]
  );

  const onDragEnd = useCallback(
    (event: DragEvent) => {
      endDrag();
    },
    [endDrag]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent, location: string, index?: number) => {
      event.preventDefault();

      if (!dragState.isDragging || !dragState.dragData) {
        return;
      }

      const dropTarget: DropTarget = {
        location,
        index,
        isValid: isValidDrop(location, index),
      };

      if (dropTarget.isValid && onCardMove) {
        onCardMove(dragState.dragData, dropTarget);
      }

      endDrag();
    },
    [dragState.isDragging, dragState.dragData, isValidDrop, onCardMove, endDrag]
  );

  // Touch Event Handlers for Mobile
  const onTouchStart = useCallback(
    (event: TouchEvent, card: Card, location: string, index: number) => {
      const touch = event.touches[0];
      if (!touch) return;

      const target = event.target as HTMLElement;
      longPressRef.current = false;

      const touchData: TouchData = {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
        element: target,
        timestamp: Date.now(),
      };

      setTouchTarget(target);
      startTouch(touchData);

      // Set up long press detection for drag initiation
      touchTimeoutRef.current = setTimeout(() => {
        longPressRef.current = true;

        const dragData: DragData = {
          card,
          sourceLocation: location,
          sourceIndex: index,
        };

        startDrag(dragData);

        // Add haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }, 500); // 500ms long press threshold
    },
    [startTouch, setTouchTarget, startDrag]
  );

  const onTouchMove = useCallback(
    (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch || !touchState.isTouching || !touchState.touchData) return;

      const { startX, startY } = touchState.touchData;
      const currentX = touch.clientX;
      const currentY = touch.clientY;

      // Calculate distance moved
      const distance = Math.sqrt(
        Math.pow(currentX - startX, 2) + Math.pow(currentY - startY, 2)
      );

      // Cancel long press if moved too much (10px threshold)
      if (distance > 10 && touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
        touchTimeoutRef.current = null;
      }

      // Update touch position
      const updatedTouchData: TouchData = {
        ...touchState.touchData,
        currentX,
        currentY,
      };

      updateTouch(updatedTouchData);

      // If we're in drag mode, prevent scrolling
      if (dragState.isDragging) {
        event.preventDefault();

        // Find element under touch point
        const elementBelow = document.elementFromPoint(currentX, currentY);
        if (elementBelow) {
          const dropZone = elementBelow.closest('[data-drop-zone]');
          if (dropZone) {
            const location = dropZone.getAttribute('data-location');
            const index = dropZone.getAttribute('data-index');

            if (location) {
              const dropTarget: DropTarget = {
                location,
                index: index ? parseInt(index, 10) : undefined,
                isValid: isValidDrop(location, index ? parseInt(index, 10) : undefined),
              };

              updateDropTarget(dropTarget);
            }
          }
        }
      }
    },
    [
      touchState.isTouching,
      touchState.touchData,
      dragState.isDragging,
      updateTouch,
      updateDropTarget,
      isValidDrop,
    ]
  );

  const onTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
        touchTimeoutRef.current = null;
      }

      // If this was a drag operation, handle the drop
      if (dragState.isDragging && dragState.dropTarget && longPressRef.current) {
        if (dragState.dropTarget.isValid && onCardMove && dragState.dragData) {
          onCardMove(dragState.dragData, dragState.dropTarget);
        }
        endDrag();
      } else if (touchState.isTouching && !longPressRef.current) {
        // This was a tap/click, handle as card flip if applicable
        const { touchData } = touchState;
        if (touchData && onCardFlip) {
          // Extract location and index from the touch target
          const target = touchData.element;
          const location = target.getAttribute('data-location');
          const index = target.getAttribute('data-index');

          if (location && index !== null) {
            onCardFlip(location, parseInt(index, 10));
          }
        }
      }

      endTouch();
      longPressRef.current = false;
    },
    [
      dragState.isDragging,
      dragState.dropTarget,
      dragState.dragData,
      touchState.isTouching,
      touchState.touchData,
      onCardMove,
      onCardFlip,
      endDrag,
      endTouch,
    ]
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  const dragHandlers: DragHandlers = {
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
  };

  const touchHandlers: TouchHandlers = {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };

  return {
    dragState,
    touchState,
    dragHandlers,
    touchHandlers,
    isValidDrop,
  };
};