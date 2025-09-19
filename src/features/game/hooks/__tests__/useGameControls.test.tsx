import { render, renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { GameTestProvider } from "../../../../test/game-test-utils";
import { useGameControls } from "../useGameControls";
import { useAtomValue, useSetAtom } from "jotai";
import { gameStateAtom, isGameWon, foundationsAtom } from "../../stores";
import type { Card } from "../../types";

// Helper to create a full foundation (Ace to King of same suit)
const createFullFoundation = (suit: "hearts" | "diamonds" | "clubs" | "spades"): Card[] => {
  return Array.from({ length: 13 }, (_, i) => ({
    id: `${suit}-${i + 1}`,
    suit,
    rank: (i + 1) as Card["rank"],
    faceUp: true,
  }));
};

describe("useGameControls", () => {
  it("should initialize with empty game state", () => {
    const { result } = renderHook(() => useGameControls(), {
      wrapper: GameTestProvider,
    });

    expect(result.current.gameState.tableau).toHaveLength(7);
    expect(result.current.gameState.foundations).toHaveLength(4);
    expect(result.current.gameState.stock).toHaveLength(0);
    expect(result.current.gameState.waste).toHaveLength(0);
    expect(result.current.isGameWon).toBe(false);
    expect(result.current.showWinMessage).toBe(false);
    expect(result.current.gameId).toBe(1);
  });

  it("should start a new game with proper setup", () => {
    const { result } = renderHook(() => useGameControls(), {
      wrapper: GameTestProvider,
    });

    act(() => {
      result.current.startNewGame();
    });

    const gameState = result.current.gameState;

    // Check tableau structure (1, 2, 3, 4, 5, 6, 7 cards)
    expect(gameState.tableau).toHaveLength(7);
    for (let i = 0; i < 7; i++) {
      expect(gameState.tableau[i]).toHaveLength(i + 1);
    }

    // Check foundations are empty
    expect(gameState.foundations).toHaveLength(4);
    gameState.foundations.forEach(foundation => {
      expect(foundation).toHaveLength(0);
    });

    // Check waste is empty
    expect(gameState.waste).toHaveLength(0);

    // Check stock has remaining cards (52 - 28 = 24)
    expect(gameState.stock).toHaveLength(24);

    // Check game ID incremented
    expect(result.current.gameId).toBe(2);

    // Check win message is hidden
    expect(result.current.showWinMessage).toBe(false);
  });

  it("should reset to empty state", () => {
    const { result } = renderHook(() => useGameControls(), {
      wrapper: GameTestProvider,
    });

    // Start a game first
    act(() => {
      result.current.startNewGame();
    });

    // Then reset to empty
    act(() => {
      result.current.resetToEmpty();
    });

    const gameState = result.current.gameState;

    // All areas should be empty
    gameState.tableau.forEach(column => {
      expect(column).toHaveLength(0);
    });

    gameState.foundations.forEach(foundation => {
      expect(foundation).toHaveLength(0);
    });

    expect(gameState.stock).toHaveLength(0);
    expect(gameState.waste).toHaveLength(0);

    // Game ID should increment
    expect(result.current.gameId).toBe(3);

    // Win message should be hidden
    expect(result.current.showWinMessage).toBe(false);
  });

  it("should detect win condition and show win message", () => {
    const TestComponent = () => {
      const { showWinMessage, isGameWon } = useGameControls();
      const setFoundations = useSetAtom(foundationsAtom);

      const triggerWin = () => {
        // Set all foundations to full (13 cards each, Ace to King)
        const fullFoundations = [
          createFullFoundation("hearts"),
          createFullFoundation("diamonds"),
          createFullFoundation("clubs"),
          createFullFoundation("spades"),
        ];
        setFoundations(fullFoundations);
      };

      return (
        <div>
          <div data-testid="win-status">{isGameWon ? "won" : "not-won"}</div>
          <div data-testid="win-message-status">{showWinMessage ? "shown" : "hidden"}</div>
          <button onClick={triggerWin} data-testid="trigger-win">Trigger Win</button>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />, {
      wrapper: GameTestProvider,
    });

    // Initially not won
    expect(getByTestId("win-status")).toHaveTextContent("not-won");
    expect(getByTestId("win-message-status")).toHaveTextContent("hidden");

    // Trigger win condition
    act(() => {
      getByTestId("trigger-win").click();
    });

    // Should detect win and show message
    expect(getByTestId("win-status")).toHaveTextContent("won");
    expect(getByTestId("win-message-status")).toHaveTextContent("shown");
  });

  it("should dismiss win message without starting new game", () => {
    const TestComponent = () => {
      const controls = useGameControls();
      const setFoundations = useSetAtom(foundationsAtom);

      const triggerWin = () => {
        const fullFoundations = [
          createFullFoundation("hearts"),
          createFullFoundation("diamonds"),
          createFullFoundation("clubs"),
          createFullFoundation("spades"),
        ];
        setFoundations(fullFoundations);
      };

      return (
        <div>
          <div data-testid="win-status">{controls.isGameWon ? "won" : "not-won"}</div>
          <div data-testid="win-message-status">{controls.showWinMessage ? "shown" : "hidden"}</div>
          <div data-testid="game-id">{controls.gameId}</div>
          <button onClick={triggerWin} data-testid="trigger-win">Trigger Win</button>
          <button onClick={controls.dismissWinMessage} data-testid="dismiss-message">Dismiss</button>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />, {
      wrapper: GameTestProvider,
    });

    // Trigger win
    act(() => {
      getByTestId("trigger-win").click();
    });

    expect(getByTestId("win-message-status")).toHaveTextContent("shown");
    expect(getByTestId("game-id")).toHaveTextContent("1");

    // Dismiss message
    act(() => {
      getByTestId("dismiss-message").click();
    });

    // Win message should be hidden but game should still be won and game ID unchanged
    expect(getByTestId("win-status")).toHaveTextContent("won");
    expect(getByTestId("win-message-status")).toHaveTextContent("hidden");
    expect(getByTestId("game-id")).toHaveTextContent("1");
  });

  it("should not show win message multiple times for same win", () => {
    const TestComponent = () => {
      const controls = useGameControls();
      const setFoundations = useSetAtom(foundationsAtom);

      const triggerWin = () => {
        const fullFoundations = [
          createFullFoundation("hearts"),
          createFullFoundation("diamonds"),
          createFullFoundation("clubs"),
          createFullFoundation("spades"),
        ];
        setFoundations(fullFoundations);
      };

      return (
        <div>
          <div data-testid="win-message-status">{controls.showWinMessage ? "shown" : "hidden"}</div>
          <button onClick={triggerWin} data-testid="trigger-win">Trigger Win</button>
          <button onClick={controls.dismissWinMessage} data-testid="dismiss-message">Dismiss</button>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />, {
      wrapper: GameTestProvider,
    });

    // Trigger win
    act(() => {
      getByTestId("trigger-win").click();
    });

    expect(getByTestId("win-message-status")).toHaveTextContent("shown");

    // Dismiss message
    act(() => {
      getByTestId("dismiss-message").click();
    });

    expect(getByTestId("win-message-status")).toHaveTextContent("hidden");

    // Trigger win again (same win condition)
    act(() => {
      getByTestId("trigger-win").click();
    });

    // Message should not show again
    expect(getByTestId("win-message-status")).toHaveTextContent("hidden");
  });

  it("should create different games each time", () => {
    const { result } = renderHook(() => useGameControls(), {
      wrapper: GameTestProvider,
    });

    act(() => {
      result.current.startNewGame();
    });

    const firstGameTableau = JSON.stringify(result.current.gameState.tableau);

    act(() => {
      result.current.startNewGame();
    });

    const secondGameTableau = JSON.stringify(result.current.gameState.tableau);

    // Games should be different due to shuffling (very high probability)
    expect(firstGameTableau).not.toBe(secondGameTableau);
    expect(result.current.gameId).toBe(3); // Started at 1, incremented twice
  });

  it("should handle edge case of partial foundation", () => {
    const TestComponent = () => {
      const { isGameWon } = useGameControls();
      const setFoundations = useSetAtom(foundationsAtom);

      const setPartialFoundation = () => {
        // Set foundations with incomplete sequences
        const partialFoundations = [
          createFullFoundation("hearts").slice(0, 12), // Missing King
          createFullFoundation("diamonds"),
          createFullFoundation("clubs"),
          createFullFoundation("spades"),
        ];
        setFoundations(partialFoundations);
      };

      return (
        <div>
          <div data-testid="win-status">{isGameWon ? "won" : "not-won"}</div>
          <button onClick={setPartialFoundation} data-testid="set-partial">Set Partial</button>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />, {
      wrapper: GameTestProvider,
    });

    act(() => {
      getByTestId("set-partial").click();
    });

    // Should not be won with incomplete foundation
    expect(getByTestId("win-status")).toHaveTextContent("not-won");
  });

  it("should properly reset win message when starting new game", () => {
    const TestComponent = () => {
      const controls = useGameControls();
      const setFoundations = useSetAtom(foundationsAtom);

      const triggerWin = () => {
        const fullFoundations = [
          createFullFoundation("hearts"),
          createFullFoundation("diamonds"),
          createFullFoundation("clubs"),
          createFullFoundation("spades"),
        ];
        setFoundations(fullFoundations);
      };

      return (
        <div>
          <div data-testid="win-status">{controls.isGameWon ? "won" : "not-won"}</div>
          <div data-testid="win-message-status">{controls.showWinMessage ? "shown" : "hidden"}</div>
          <button onClick={triggerWin} data-testid="trigger-win">Trigger Win</button>
          <button onClick={controls.startNewGame} data-testid="new-game">New Game</button>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />, {
      wrapper: GameTestProvider,
    });

    // Trigger win
    act(() => {
      getByTestId("trigger-win").click();
    });

    expect(getByTestId("win-status")).toHaveTextContent("won");
    expect(getByTestId("win-message-status")).toHaveTextContent("shown");

    // Start new game
    act(() => {
      getByTestId("new-game").click();
    });

    // Win condition should be reset and message should be hidden
    expect(getByTestId("win-status")).toHaveTextContent("not-won");
    expect(getByTestId("win-message-status")).toHaveTextContent("hidden");
  });
});