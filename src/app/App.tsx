import type React from "react";
import { cn } from "@/lib/utils";
import { SolitaireGame } from "./components/SolitaireGame";
import { AppProvider } from "./providers/AppProvider";

interface AppProps {
  className?: string;
}

export const App: React.FC<AppProps> = ({ className }) => {
  return (
    <AppProvider>
      <div className={cn("min-h-screen bg-gray-50", className)}>
        <SolitaireGame />
      </div>
    </AppProvider>
  );
};