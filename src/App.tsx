import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Monsters from "./pages/Monster";
import Armor from "./pages/Armor";
import Weapons from "./pages/Weapon";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Header />
        <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/monsters" element={<Monsters />} />
          <Route path="/armor" element={<Armor />} />
          <Route path="/weapons" element={<Weapons />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
