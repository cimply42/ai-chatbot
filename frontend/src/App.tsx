import "./App.css";
import ChatDialog from "./components/ChatDialog";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="mt-auto ml-auto p-10">
          <ChatDialog />
        </div>
      </header>
    </div>
  );
}

export default App;
