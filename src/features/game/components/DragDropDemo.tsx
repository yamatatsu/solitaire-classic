import React, { useState } from "react";
import { Provider } from "jotai";
import { Card } from "./Card";
import { useDragAndDrop, useStockPile } from "../hooks";
import type { Card as CardType, DragData, DropTarget } from "../types";

const createTestCard = (suit: string, rank: number, faceUp = true): CardType => ({
  id: `${suit}-${rank}`,
  suit: suit as CardType["suit"],
  rank: rank as CardType["rank"],
  faceUp,
});

/**
 * Demo component for testing drag and drop interactions
 * Useful for manual testing on various devices and browsers
 */
export const DragDropDemo: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [testCards] = useState<CardType[]>([
    createTestCard("hearts", 1),
    createTestCard("diamonds", 2),
    createTestCard("clubs", 3),
    createTestCard("spades", 13),
  ]);

  const addMessage = (message: string) => {
    setMessages(prev => [`${new Date().toLocaleTimeString()}: ${message}`, ...prev.slice(0, 9)]);
  };

  const handleCardMove = (dragData: DragData, dropTarget: DropTarget) => {
    addMessage(`Card moved: ${dragData.card.suit} ${dragData.card.rank} from ${dragData.sourceLocation} to ${dropTarget.location}`);
  };

  const handleCardFlip = (location: string, cardIndex: number) => {
    addMessage(`Card flipped at ${location}, index ${cardIndex}`);
  };

  const handleStockClick = () => {
    addMessage("Stock pile clicked");
  };

  const { dragState, touchState, dragHandlers, touchHandlers, isValidDrop } = useDragAndDrop({
    onCardMove: handleCardMove,
    onCardFlip: handleCardFlip,
  });

  const stockPile = useStockPile({
    drawCount: 3,
    onStockClick: handleStockClick,
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Drag & Drop Test Interface</h1>

      {/* Status Display */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Drag State:</strong>
            <ul className="list-disc list-inside ml-2">
              <li>Is Dragging: {dragState.isDragging ? "Yes" : "No"}</li>
              <li>Source: {dragState.dragData?.sourceLocation || "None"}</li>
              <li>Card: {dragState.dragData ? `${dragState.dragData.card.suit} ${dragState.dragData.card.rank}` : "None"}</li>
            </ul>
          </div>
          <div>
            <strong>Touch State:</strong>
            <ul className="list-disc list-inside ml-2">
              <li>Is Touching: {touchState.isTouching ? "Yes" : "No"}</li>
              <li>Start: {touchState.touchData ? `${touchState.touchData.startX}, ${touchState.touchData.startY}` : "None"}</li>
              <li>Current: {touchState.touchData ? `${touchState.touchData.currentX}, ${touchState.touchData.currentY}` : "None"}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Test Cards */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Test Cards (Drag/Touch these)</h2>
        <div className="flex flex-wrap gap-4">
          {testCards.map((card, index) => (
            <div
              key={card.id}
              data-location="test-area"
              data-index={index}
              className="cursor-pointer"
            >
              <Card
                card={card}
                size="medium"
                draggable
                data-testid={`test-card-${card.id}`}
                onDragStart={(e) => dragHandlers.onDragStart(e.nativeEvent, card, "test-area", index)}
                onDragEnd={(e) => dragHandlers.onDragEnd(e.nativeEvent)}
                onTouchStart={(e) => touchHandlers.onTouchStart(e.nativeEvent, card, "test-area", index)}
                onTouchMove={(e) => touchHandlers.onTouchMove(e.nativeEvent)}
                onTouchEnd={(e) => touchHandlers.onTouchEnd(e.nativeEvent)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Drop Zones */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Drop Zones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["foundation-0", "foundation-1", "tableau-0"].map((location) => (
            <div
              key={location}
              data-drop-zone
              data-location={location}
              className={`
                h-32 border-2 border-dashed border-gray-300 rounded-lg
                flex items-center justify-center text-gray-500
                ${isValidDrop(location) ? "border-green-500 bg-green-50" : ""}
                ${dragState.isDragging ? "border-blue-500" : ""}
              `}
              onDragOver={(e) => dragHandlers.onDragOver(e.nativeEvent)}
              onDrop={(e) => dragHandlers.onDrop(e.nativeEvent, location)}
            >
              {location}
              {isValidDrop(location) && <span className="ml-2 text-green-600">✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Stock Pile Test */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Stock Pile Test</h2>
        <div className="flex gap-4 items-center">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            onClick={stockPile.drawFromStock}
            disabled={!stockPile.canDrawFromStock}
          >
            Draw from Stock ({stockPile.stock.length} cards)
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded disabled:bg-gray-300"
            onClick={stockPile.recycleStock}
            disabled={!stockPile.canRecycleStock}
          >
            Recycle Stock ({stockPile.waste.length} waste)
          </button>
        </div>
      </div>

      {/* Performance Test */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Performance Test</h2>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded"
          onClick={() => {
            const startTime = performance.now();
            const card = testCards[0];

            // Simulate rapid touch events
            for (let i = 0; i < 10; i++) {
              const mockEvent = {
                touches: [{ clientX: 100 + i, clientY: 200 + i }],
                target: document.createElement("div"),
              } as unknown as TouchEvent;

              touchHandlers.onTouchStart(mockEvent, card, "test-area", 0);
              touchHandlers.onTouchEnd({} as TouchEvent);
            }

            const endTime = performance.now();
            const totalTime = endTime - startTime;

            addMessage(`Performance Test: ${totalTime.toFixed(2)}ms for 10 touch events (avg: ${(totalTime/10).toFixed(2)}ms per event)`);
          }}
        >
          Run Performance Test
        </button>
      </div>

      {/* Event Log */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Event Log</h2>
        <div className="h-48 overflow-y-auto bg-black text-green-400 p-3 rounded font-mono text-sm">
          {messages.length === 0 ? (
            <div className="text-gray-500">No events yet. Try dragging cards or clicking buttons above.</div>
          ) : (
            messages.map((message, index) => (
              <div key={index}>{message}</div>
            ))
          )}
        </div>
        <button
          className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm"
          onClick={() => setMessages([])}
        >
          Clear Log
        </button>
      </div>

      {/* Device Info */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Device Info</h2>
        <div className="text-sm">
          <p><strong>User Agent:</strong> {navigator.userAgent}</p>
          <p><strong>Touch Support:</strong> {'ontouchstart' in window ? 'Yes' : 'No'}</p>
          <p><strong>Vibrate Support:</strong> {'vibrate' in navigator ? 'Yes' : 'No'}</p>
          <p><strong>Screen Size:</strong> {window.screen.width} x {window.screen.height}</p>
          <p><strong>Viewport Size:</strong> {window.innerWidth} x {window.innerHeight}</p>
        </div>
      </div>

      {/* Test Instructions */}
      <div className="p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Test Instructions</h2>
        <div className="text-sm space-y-2">
          <p><strong>Desktop:</strong> Try dragging cards to drop zones using mouse.</p>
          <p><strong>Mobile:</strong> Long press (500ms) on cards to start dragging, then move to drop zones.</p>
          <p><strong>Quick Tap:</strong> Quick tap on cards should trigger flip action.</p>
          <p><strong>Performance:</strong> Check that all interactions respond within 100ms.</p>
          <p><strong>Cross-browser:</strong> Test on Chrome, Firefox, Safari, and Edge.</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Wrapper component with Jotai Provider for standalone usage
 */
export const DragDropDemoWithProvider: React.FC = () => (
  <Provider>
    <DragDropDemo />
  </Provider>
);