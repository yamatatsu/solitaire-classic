import { atom } from "jotai";
import type { DragData, DragState, DropTarget, TouchData, TouchState } from "../types";

// Base drag state atom
export const dragStateAtom = atom<DragState>({
  isDragging: false,
  dragData: null,
  dropTarget: null,
  dragPreview: null,
});

// Base touch state atom
export const touchStateAtom = atom<TouchState>({
  isTouching: false,
  touchData: null,
  touchTarget: null,
});

// Action to start dragging
export const startDragAtom = atom(
  null,
  (get, set, dragData: DragData) => {
    set(dragStateAtom, {
      ...get(dragStateAtom),
      isDragging: true,
      dragData,
    });
  }
);

// Action to update drop target
export const updateDropTargetAtom = atom(
  null,
  (get, set, dropTarget: DropTarget | null) => {
    set(dragStateAtom, {
      ...get(dragStateAtom),
      dropTarget,
    });
  }
);

// Action to set drag preview element
export const setDragPreviewAtom = atom(
  null,
  (get, set, dragPreview: HTMLElement | null) => {
    set(dragStateAtom, {
      ...get(dragStateAtom),
      dragPreview,
    });
  }
);

// Action to end dragging
export const endDragAtom = atom(
  null,
  (get, set) => {
    set(dragStateAtom, {
      isDragging: false,
      dragData: null,
      dropTarget: null,
      dragPreview: null,
    });
  }
);

// Action to start touch interaction
export const startTouchAtom = atom(
  null,
  (get, set, touchData: TouchData) => {
    set(touchStateAtom, {
      ...get(touchStateAtom),
      isTouching: true,
      touchData,
    });
  }
);

// Action to update touch data
export const updateTouchAtom = atom(
  null,
  (get, set, touchData: TouchData) => {
    set(touchStateAtom, {
      ...get(touchStateAtom),
      touchData,
    });
  }
);

// Action to set touch target element
export const setTouchTargetAtom = atom(
  null,
  (get, set, touchTarget: HTMLElement | null) => {
    set(touchStateAtom, {
      ...get(touchStateAtom),
      touchTarget,
    });
  }
);

// Action to end touch interaction
export const endTouchAtom = atom(
  null,
  (get, set) => {
    set(touchStateAtom, {
      isTouching: false,
      touchData: null,
      touchTarget: null,
    });
  }
);

// Derived atom to check if currently dragging or touching
export const isInteractingAtom = atom<boolean>((get) => {
  const dragState = get(dragStateAtom);
  const touchState = get(touchStateAtom);
  return dragState.isDragging || touchState.isTouching;
});