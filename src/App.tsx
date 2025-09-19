import "./App.css";

// Props interface for the App component
interface AppProps {
  className?: string;
}

function App({ className }: AppProps) {
  return (
    <main className={`app ${className || ""}`}>
      <header className="app-header">
        <h1 className="greeting">Hello World</h1>
        <p className="subtitle">Welcome to Solitaire Classic</p>
      </header>
    </main>
  );
}

export default App;
