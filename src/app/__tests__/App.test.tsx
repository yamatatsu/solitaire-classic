import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "../App";

describe("App Integration", () => {
  it("should render the complete solitaire game", () => {
    render(<App />);

    // Check for main header
    expect(screen.getByText("Solitaire Classic")).toBeInTheDocument();
    expect(screen.getByText("Klondike Solitaire - Complete MVP")).toBeInTheDocument();

    // Check for New Game button
    expect(screen.getByRole("button", { name: /new game/i })).toBeInTheDocument();

    // Check for game status
    expect(screen.getByText("Game in Progress")).toBeInTheDocument();

    // Check for game board sections
    expect(screen.getByText("Foundation")).toBeInTheDocument();
    expect(screen.getByText("Stock & Waste")).toBeInTheDocument();
    expect(screen.getByText("Tableau")).toBeInTheDocument();

    // Check for Stock and Waste labels (multiple instances expected)
    expect(screen.getAllByText("Stock").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Waste").length).toBeGreaterThan(0);
  });

  it("should start a new game when New Game button is clicked", async () => {
    render(<App />);
    const user = userEvent.setup();

    const newGameButton = screen.getByRole("button", { name: /new game/i });

    // Click New Game button
    await user.click(newGameButton);

    // Game should now have cards (we can't test exact layout due to randomization,
    // but we can check that the structure is there)
    expect(screen.getByText("Foundation")).toBeInTheDocument();
    expect(screen.getByText("Tableau")).toBeInTheDocument();
  });

  it("should show game areas with proper labels", () => {
    render(<App />);

    // Foundation area
    expect(screen.getByTestId("game-foundation")).toBeInTheDocument();

    // Stock area
    expect(screen.getByTestId("game-stock")).toBeInTheDocument();

    // Waste area
    expect(screen.getByTestId("game-waste")).toBeInTheDocument();

    // Tableau area
    expect(screen.getByTestId("game-tableau")).toBeInTheDocument();
  });

  it("should display card counts in the footer", () => {
    render(<App />);

    // Should show card count information
    expect(screen.getByText(/Stock:/)).toBeInTheDocument();
    expect(screen.getByText(/Waste:/)).toBeInTheDocument();
    expect(screen.getByText(/Foundations:/)).toBeInTheDocument();
    expect(screen.getByText(/Tableau:/)).toBeInTheDocument();
  });

  it("should be accessible with proper ARIA labels", () => {
    render(<App />);

    // Main game board should have proper accessibility
    const gameBoard = screen.getByTestId("game-board");
    expect(gameBoard).toHaveAttribute("aria-label", "Solitaire Game Board");
  });
});