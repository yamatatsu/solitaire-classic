import "./App.css";
import { Button } from "@/components/ui/button";

// Props interface for the App component
interface AppProps {
  className?: string;
}

function App({ className }: AppProps) {
  return (
    <main className={`app ${className || ""}`}>
      <header className="app-header">
        <h1 className="greeting text-4xl font-bold text-blue-600">
          Hello World
        </h1>
        <p className="subtitle text-lg text-gray-600 mt-2">
          Welcome to Solitaire Classic
        </p>
        <div className="mt-4 space-x-4">
          <Button variant="default">shadcn Default Button</Button>
          <Button variant="outline">shadcn Outline Button</Button>
          <Button variant="destructive">shadcn Destructive</Button>
        </div>
      </header>
    </main>
  );
}

export default App;
