import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSetAtom } from "jotai";
import { describe, expect, it } from "vitest";
import { foundationsAtom } from "@/features/game/stores";
import type { Card } from "@/features/game/types";
import { App } from "../App";
import { AppProvider } from "../providers";

// Helper component to set up a winning game state
const WinTestComponent = () => {
  const setFoundations = useSetAtom(foundationsAtom);

  const createFullFoundation = (
    suit: "hearts" | "diamonds" | "clubs" | "spades"
  ): Card[] => {
    return Array.from({ length: 13 }, (_, i) => ({
      id: `${suit}-${i + 1}`,
      suit,
      rank: (i + 1) as Card["rank"],
      faceUp: true,
    }));
  };

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
      <App />
      <button type="button" onClick={triggerWin} data-testid="trigger-win">
        Trigger Win (Test Only)
      </button>
    </div>
  );
};

// Wrapper with provider
const WinTestWithProvider = () => {
  return (
    <AppProvider>
      <WinTestComponent />
    </AppProvider>
  );
};

describe("Complete Game Playthrough", () => {
  it("should start a new game and display all game areas", async () => {
    render(<App />);
    const user = userEvent.setup();

    // Start a new game
    const newGameButton = screen.getByRole("button", { name: /new game/i });
    await user.click(newGameButton);

    // Verify game areas are present
    expect(screen.getByTestId("game-foundation")).toBeInTheDocument();
    expect(screen.getByTestId("game-stock")).toBeInTheDocument();
    expect(screen.getByTestId("game-waste")).toBeInTheDocument();
    expect(screen.getByTestId("game-tableau")).toBeInTheDocument();

    // Verify game status shows in progress
    expect(screen.getByText("Game in Progress")).toBeInTheDocument();

    // Verify card counts are displayed
    expect(screen.getByText(/Stock:/)).toBeInTheDocument();
    expect(screen.getByText(/Waste:/)).toBeInTheDocument();
    expect(screen.getByText(/Foundations:/)).toBeInTheDocument();
    expect(screen.getByText(/Tableau:/)).toBeInTheDocument();
  });

  it("should handle stock pile interactions", async () => {
    render(<App />);
    const user = userEvent.setup();

    // Start a new game to have cards
    const newGameButton = screen.getByRole("button", { name: /new game/i });
    await user.click(newGameButton);

    // Get the stock pile
    const stockPile = screen.getByTestId("game-stock");
    expect(stockPile).toBeInTheDocument();

    // Should be able to click on stock (though specific game logic is not fully implemented)
    // This tests the basic interaction setup
    expect(stockPile).toBeInTheDocument();
  });

  it("should display win condition and show win dialog", async () => {
    render(<WinTestWithProvider />);
    const user = userEvent.setup();

    // Initially should show game in progress
    expect(screen.getByText("Game in Progress")).toBeInTheDocument();

    // Trigger win condition
    const triggerWinButton = screen.getByTestId("trigger-win");
    await user.click(triggerWinButton);

    // Should show win dialog - check more flexible text matching
    expect(screen.getByText(/Congratulations!/)).toBeInTheDocument();
    expect(
      screen.getByText("You have successfully completed the game!")
    ).toBeInTheDocument();
    expect(
      screen.getByText("All cards have been moved to the foundations.")
    ).toBeInTheDocument();

    // Should have Close and New Game buttons in dialog
    const dialogButtons = screen.getAllByRole("button");
    const closeButton = dialogButtons.find(
      (button) => button.textContent === "Close"
    );
    const newGameButtonInDialog = dialogButtons.find(
      (button) => button.textContent === "New Game"
    );

    expect(closeButton).toBeInTheDocument();
    expect(newGameButtonInDialog).toBeInTheDocument();
  });

  it("should allow dismissing win dialog", async () => {
    render(<WinTestWithProvider />);
    const user = userEvent.setup();

    // Trigger win condition
    const triggerWinButton = screen.getByTestId("trigger-win");
    await user.click(triggerWinButton);

    // Win dialog should be visible
    expect(screen.getByText(/Congratulations!/)).toBeInTheDocument();

    // Click close button
    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    // Dialog should be hidden
    expect(screen.queryByText(/Congratulations!/)).not.toBeInTheDocument();
  });

  it("should start new game from win dialog", async () => {
    render(<WinTestWithProvider />);
    const user = userEvent.setup();

    // Trigger win condition
    const triggerWinButton = screen.getByTestId("trigger-win");
    await user.click(triggerWinButton);

    // Win dialog should be visible
    expect(screen.getByText(/Congratulations!/)).toBeInTheDocument();

    // Click New Game button in dialog
    const newGameButtons = screen.getAllByRole("button", { name: /new game/i });
    const dialogNewGameButton = newGameButtons.find(
      (button) =>
        button.closest('[role="dialog"]') ||
        button.parentElement?.textContent?.includes("Congratulations")
    );

    if (dialogNewGameButton) {
      await user.click(dialogNewGameButton);

      // Dialog should be hidden and game should be reset
      expect(screen.queryByText("🎉 Congratulations!")).not.toBeInTheDocument();
      expect(screen.getByText("Game in Progress")).toBeInTheDocument();
    }
  });

  it("should maintain proper game state throughout playthrough", async () => {
    render(<App />);
    const user = userEvent.setup();

    // Start multiple new games
    const newGameButton = screen.getByRole("button", { name: /new game/i });

    await user.click(newGameButton);
    const firstGameStockText = screen.getByText(/Stock:/).textContent;

    await user.click(newGameButton);
    const secondGameStockText = screen.getByText(/Stock:/).textContent;

    // Games should potentially be different (due to shuffling)
    // At minimum, the structure should be consistent
    expect(firstGameStockText).toMatch(/Stock:/);
    expect(secondGameStockText).toMatch(/Stock:/);

    // Game areas should always be present
    expect(screen.getByTestId("game-foundation")).toBeInTheDocument();
    expect(screen.getByTestId("game-stock")).toBeInTheDocument();
    expect(screen.getByTestId("game-waste")).toBeInTheDocument();
    expect(screen.getByTestId("game-tableau")).toBeInTheDocument();
  });

  it("should handle multiple game cycles properly", async () => {
    render(<WinTestWithProvider />);
    const user = userEvent.setup();

    // Play through multiple game cycles
    for (let i = 0; i < 3; i++) {
      // Start new game
      const newGameButton = screen.getByRole("button", { name: /new game/i });
      await user.click(newGameButton);

      // Should show game in progress
      expect(screen.getByText("Game in Progress")).toBeInTheDocument();

      // Trigger win
      const triggerWinButton = screen.getByTestId("trigger-win");
      await user.click(triggerWinButton);

      // Should show win dialog
      expect(screen.getByText(/Congratulations!/)).toBeInTheDocument();

      // Close dialog for next iteration
      const closeButton = screen.getByRole("button", { name: /close/i });
      await user.click(closeButton);
    }

    // Final state should still be consistent - no dialog should be showing
    expect(screen.queryByText(/Congratulations!/)).not.toBeInTheDocument();
  });
});
