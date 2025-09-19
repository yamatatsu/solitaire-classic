import "./App.css";

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
        <div className="mt-4">
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Test Tailwind Button
          </button>
        </div>
      </header>
    </main>
  );
}

export default App;
