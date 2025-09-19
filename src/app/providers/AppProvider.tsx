import { Provider } from "jotai";
import type React from "react";

interface AppProviderProps {
  children: React.ReactNode;
}

/**
 * Main application provider that sets up all necessary contexts
 * Currently provides Jotai store for game state management
 */
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <Provider>{children}</Provider>;
};
