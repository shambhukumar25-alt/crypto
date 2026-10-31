import CryptoList from "./components/CryptoList";
import Favorites from "./components/Favorites";

function App() {
  return (
    <div>
      <h1>Crypto Price Tracker</h1>

      <CryptoList />

      <Favorites />
    </div>
  );
}

export default App;