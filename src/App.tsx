// import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Monsters from "./pages/Monster";
import Armor from "./pages/Armor";
import ArmorDetail from "./pages/ArmorDetail";
import Weapons from "./pages/Weapon";
import Map from "./pages/Map";
import Header from "./components/Header";
import WeaponDetail from "./pages/WeaponDetail";
import WeaponTree from "./pages/WeaponTree";
import MonsterDetail from "./pages/MonsterDetail";
import Item from "./pages/Item";
import ItemDetail from "./pages/ItemDetail";
// import SnowyMountainsMap from "./pages/MapDetail-leaflet";
import MapDetail from "./pages/MapDetail";
import MapDetailDev from "./pages/MapDetailDev";
import Decoration from "./pages/Decoration";

import { MobilePendingPage } from "./pages/MobilePendingPage";
import DevBanner from "./components/DevBanner";
import DecorationDetail from "./pages/DecorationDetail";

function App() {
  return (
    <>
      <div className="md:hidden">
        <MobilePendingPage />
      </div>
      <div className="hidden md:block">
        <Router>
          <DevBanner />
          <Header />
          {/* <main style={{ padding: "1rem" }}> */}
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/monsters" element={<Monsters />} />
              <Route path="/monster/:monsterName" element={<MonsterDetail />} />
              <Route path="/armor" element={<Armor />} />
              <Route path="/armor/:armorName" element={<ArmorDetail />} />
              <Route path="/weapons" element={<Weapons />} />
              <Route path="/weapons/:weaponName" element={<WeaponDetail />} />
              <Route path="/weapons/tree" element={<WeaponTree />} />
              <Route path="/item" element={<Item />} />
              <Route path="/item/:itemName" element={<ItemDetail />} />
              <Route path="/maps" element={<Map />} />
              <Route path="/maps/:mapName" element={<MapDetail />} />
              <Route path="/maps/dev/:mapName" element={<MapDetailDev />} />
              {/* <Route path="/map-detail" element={<SnowyMountainsMap />} /> */}
              <Route path="/decorations" element={<Decoration />} />
              <Route
                path="/decorations/:decorationName"
                element={<DecorationDetail />}
              />
            </Routes>
          </main>
        </Router>
      </div>
    </>
  );
}

export default App;
