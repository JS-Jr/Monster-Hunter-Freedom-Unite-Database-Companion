// import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Monsters from "./pages/Monster";
import Armor from "./pages/Armor";
import Weapons from "./pages/Weapon";
import Map from "./pages/Map";
import Header from "./components/Header";
import WeaponDetail from "./pages/WeaponDetail";
import WeaponTree from "./pages/WeaponTree";
import MonsterDetail from "./pages/MonsterDetail";
import Item from "./pages/Item";

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
          <Route path="/maps" element={<Map />} />
          <Route path="/weapons/:weaponName" element={<WeaponDetail />} />
          <Route path="/weapons/tree" element={<WeaponTree />} />
          <Route path="/monster/:monsterName" element={<MonsterDetail />} />
          <Route path="/item" element={<Item />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
