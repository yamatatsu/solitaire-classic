// Mock data for testing card and game functionality

export const mockSuits = ["hearts", "diamonds", "clubs", "spades"] as const;
export const mockRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;

export type MockSuit = (typeof mockSuits)[number];
export type MockRank = (typeof mockRanks)[number];

export interface MockCard {
  suit: MockSuit;
  rank: MockRank;
  faceUp: boolean;
  id?: string;
}

// Factory functions for creating mock cards
export const createMockCard = (
  suit: MockSuit = "hearts",
  rank: MockRank = 1,
  faceUp = true
): MockCard => ({
  suit,
  rank,
  faceUp,
  id: `${suit}-${rank}`,
});

// Predefined test cards
export const testCards = {
  aceOfHearts: createMockCard("hearts", 1),
  kingOfSpades: createMockCard("spades", 13),
  queenOfDiamonds: createMockCard("diamonds", 12),
  jackOfClubs: createMockCard("clubs", 11),
  twoOfHearts: createMockCard("hearts", 2),
  threeOfSpades: createMockCard("spades", 3),
} as const;

// Mock game state data
export const mockGameStates = {
  empty: {
    tableau: Array(7).fill([]),
    foundations: Array(4).fill([]),
    stock: [],
    waste: [],
  },

  withSomeCards: {
    tableau: [
      [createMockCard("hearts", 1)],
      [createMockCard("spades", 2), createMockCard("hearts", 3)],
      [],
      [],
      [],
      [],
      [],
    ],
    foundations: [[], [], [], []],
    stock: [
      createMockCard("clubs", 4, false),
      createMockCard("diamonds", 5, false),
    ],
    waste: [createMockCard("spades", 6)],
  },
} as const;

// Helper functions for creating test scenarios
export const createFullDeck = (): MockCard[] => {
  const deck: MockCard[] = [];
  for (const suit of mockSuits) {
    for (const rank of mockRanks) {
      deck.push(createMockCard(suit, rank, false));
    }
  }
  return deck;
};

export const createTableauColumn = (cards: MockCard[]): MockCard[] => {
  return cards.map((card, index) => ({
    ...card,
    faceUp: index === cards.length - 1, // Only top card is face up
  }));
};

// Utility functions for test assertions
export const isValidMove = {
  tableauToFoundation: (card: MockCard, foundationTop?: MockCard): boolean => {
    if (!foundationTop) return card.rank === 1;
    return (
      card.suit === foundationTop.suit && card.rank === foundationTop.rank + 1
    );
  },

  tableauToTableau: (card: MockCard, targetTop?: MockCard): boolean => {
    if (!targetTop) return card.rank === 13;
    const isAlternatingColor =
      (card.suit === "hearts" || card.suit === "diamonds") !==
      (targetTop.suit === "hearts" || targetTop.suit === "diamonds");
    return isAlternatingColor && card.rank === targetTop.rank - 1;
  },
};
