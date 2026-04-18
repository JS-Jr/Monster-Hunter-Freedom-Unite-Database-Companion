// App.tsx
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Monsters from "./pages/Monster";
import ArmorPage from "./pages/Armor";
import ArmorDetail from "./pages/ArmorDetail";
import Weapons from "./pages/Weapon";
import Map from "./pages/Map";
import Header from "./components/Header";
import WeaponDetail from "./pages/WeaponDetail";
import WeaponTree from "./pages/WeaponTree";
import MonsterDetail from "./pages/MonsterDetail";
import Item from "./pages/Item";
import ItemDetail from "./pages/ItemDetail";
import MapDetail from "./pages/MapDetail";
import MapDetailDev from "./pages/MapDetailDev";
import Decoration from "./pages/Decoration";
import DecorationDetail from "./pages/DecorationDetail";
import NotFound from "./pages/NotFound";
import Skill from "./pages/Skill";
import ArmorSkillBuilder from "./pages/ArmorSkillBuilder";
import SelectRedirect from "./pages/SelectRedirect";
import Acknowledgements from "./pages/Acknowledgements";
import CWCheats from "./components/CWCheats";
import Quest from "./pages/Quest";
import ItemCombination from "./pages/ItemCombination";

import { MobilePendingPage } from "./pages/MobilePendingPage";
import DevBanner from "./components/DevBanner";
import { Status } from "./pages/Status";
import { useState } from "react";
import { ArmorLoader } from "./loaders/ArmorLoader";

// Layout wrapper to include Header on all routes
function RootLayout() {
  return (
    <>
      <DevBanner />
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/monsters",
        element: <Monsters />,
      },
      {
        path: "/monster/:monsterName",
        element: <MonsterDetail />,
      },
      {
        path: "/armor",
        element: <ArmorPage />,
        // loader: ArmorLoader,
      },
      {
        path: "/armor/:armorName",
        element: <ArmorDetail />,
      },
      {
        path: "/weapons",
        element: <Weapons />,
      },
      {
        path: "/weapons/:weaponName",
        element: <WeaponDetail />,
      },
      {
        path: "/weapons/tree",
        element: <WeaponTree />,
      },
      {
        path: "/item",
        element: <Item />,
      },
      {
        path: "/item/:itemName",
        element: <ItemDetail />,
      },
      {
        path: "/maps",
        element: <Map />,
      },
      {
        path: "/maps/:mapName",
        element: <MapDetail />,
      },
      {
        path: "/maps/dev/:mapName",
        element: <MapDetailDev />,
      },
      {
        path: "/status",
        element: <Status />,
      },
      {
        path: "/decorations",
        element: <Decoration />,
      },
      {
        path: "/decorations/:decorationName",
        element: <DecorationDetail />,
      },
      {
        path: "/skills",
        element: <Skill />,
      },
      {
        path: "/skill-builder",
        element: <ArmorSkillBuilder />,
      },
      {
        path: "/select/:type",
        element: <SelectRedirect />,
      },
      {
        path: "/cwcheats",
        element: <CWCheats />,
      },
      {
        path: "/acknowledgements",
        element: <Acknowledgements />,
      },
      {
        path: "/quests",
        element: <Quest />,
      },
      {
        path: "/item-combination",
        element: <ItemCombination />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  const [forceDesktop, setForceDesktop] = useState(false);

  return (
    <>
      <div className={`${forceDesktop ? "hidden" : "md:hidden"}`}>
        <MobilePendingPage onContinue={() => setForceDesktop(true)} />
      </div>
      <div className={`${forceDesktop ? "block" : "hidden md:block"}`}>
        <RouterProvider router={router} />
      </div>
    </>
  );
}

export default App;
