// Game types and interfaces for solitaire

export type Suit = "hearts" | "diamonds" | "clubs" | "spades";
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
export type Color = "red" | "black";

export interface Card {
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
  id: string;
}

export interface GameState {
  tableau: Card[][];
  foundations: Card[][];
  stock: Card[];
  waste: Card[];
}

export interface MoveAction {
  type: "MOVE_CARD" | "FLIP_CARD" | "DEAL_CARD" | "RESET_STOCK";
  payload: {
    from?: string;
    to?: string;
    cardId?: string;
    cards?: Card[];
  };
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Validation constants
export const SUITS: readonly Suit[] = [
  "hearts",
  "diamonds",
  "clubs",
  "spades",
] as const;
export const RANKS: readonly Rank[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
] as const;
export const MOVE_TYPES: readonly MoveAction["type"][] = [
  "MOVE_CARD",
  "FLIP_CARD",
  "DEAL_CARD",
  "RESET_STOCK",
] as const;

// Simple validation functions
export const isValidSuit = (value: unknown): boolean => {
  return typeof value === "string" && SUITS.includes(value as Suit);
};

export const isValidRank = (value: unknown): boolean => {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 13 &&
    !Number.isNaN(value) &&
    Number.isFinite(value)
  );
};

export const isValidCard = (value: unknown): boolean => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    isValidSuit(obj.suit) &&
    isValidRank(obj.rank) &&
    typeof obj.faceUp === "boolean" &&
    typeof obj.id === "string"
  );
};

// Type guards
export const isSuit = (value: unknown): value is Suit => {
  return isValidSuit(value);
};

export const isRank = (value: unknown): value is Rank => {
  return isValidRank(value);
};

export const isCard = (value: unknown): value is Card => {
  return isValidCard(value);
};

export const isGameState = (value: unknown): value is GameState => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    Array.isArray(obj.tableau) &&
    Array.isArray(obj.foundations) &&
    Array.isArray(obj.stock) &&
    Array.isArray(obj.waste)
  );
};

export const isMoveAction = (value: unknown): value is MoveAction => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.type === "string" &&
    MOVE_TYPES.includes(obj.type as MoveAction["type"]) &&
    typeof obj.payload === "object" &&
    obj.payload !== null
  );
};

// Validation functions with detailed error messages
export const validateCard = (value: unknown): ValidationResult => {
  const errors: string[] = [];

  if (typeof value !== "object" || value === null) {
    return {
      isValid: false,
      errors: ["Card must be an object"],
    };
  }

  const obj = value as Record<string, unknown>;

  if (!isValidSuit(obj.suit)) {
    errors.push(`Invalid suit: ${obj.suit}`);
  }

  if (!isValidRank(obj.rank)) {
    errors.push(`Invalid rank: ${obj.rank}`);
  }

  if (typeof obj.faceUp !== "boolean") {
    errors.push("faceUp must be a boolean");
  }

  if (typeof obj.id !== "string") {
    errors.push("id must be a string");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateGameState = (value: unknown): ValidationResult => {
  const errors: string[] = [];

  if (typeof value !== "object" || value === null) {
    return {
      isValid: false,
      errors: ["GameState must be an object"],
    };
  }

  const obj = value as Record<string, unknown>;

  if (!Array.isArray(obj.tableau)) {
    errors.push("tableau must be an array");
  }

  if (!Array.isArray(obj.foundations)) {
    errors.push("foundations must be an array");
  }

  if (!Array.isArray(obj.stock)) {
    errors.push("stock must be an array");
  }

  if (!Array.isArray(obj.waste)) {
    errors.push("waste must be an array");
  }

  if (obj.waste === undefined) {
    errors.push("waste is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateMoveAction = (value: unknown): ValidationResult => {
  const errors: string[] = [];

  if (typeof value !== "object" || value === null) {
    return {
      isValid: false,
      errors: ["MoveAction must be an object"],
    };
  }

  const obj = value as Record<string, unknown>;

  if (typeof obj.type !== "string") {
    errors.push("type must be a string");
  } else if (!MOVE_TYPES.includes(obj.type as MoveAction["type"])) {
    errors.push(`Invalid action type: ${obj.type}`);
  }

  if (typeof obj.payload !== "object" || obj.payload === null) {
    errors.push("payload must be an object");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Drag and Drop Types
export interface Position {
  x: number;
  y: number;
}

export interface DragData {
  card: Card;
  cards?: Card[]; // For dragging multiple cards
  sourceLocation: string;
  sourceIndex: number;
}

export interface DropTarget {
  location: string;
  index?: number;
  isValid: boolean;
}

export interface TouchData {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  element: HTMLElement;
  timestamp: number;
}

export type GameLocation =
  | "stock"
  | "waste"
  | `foundation-${number}`
  | `tableau-${number}`;

export interface DragState {
  isDragging: boolean;
  dragData: DragData | null;
  dropTarget: DropTarget | null;
  dragPreview: HTMLElement | null;
}

export interface TouchState {
  isTouching: boolean;
  touchData: TouchData | null;
  touchTarget: HTMLElement | null;
}
