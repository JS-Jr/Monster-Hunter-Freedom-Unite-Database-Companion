import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const links = [
    { path: "/", label: "Home" },
    { path: "/monsters", label: "Monsters" },
    { path: "/armor", label: "Armor" },
    { path: "/weapons", label: "Weapons" },
    { path: "/maps", label: "Maps" },
    { path: "/weapons/tree", label: "Weapon Tree" },
    { path: "/item", label: "Item" },
    { path: "/decorations", label: "Decoration" },
    { path: "/skills", label: "Skill" },
    { path: "/skill-builder", label: "Armor Skill Builder" },
    { path: "/status", label: "Status/State" },
  ];

  const otherLinks = [
    { path: "/cwcheats", label: "CW Cheats" },
    { path: "/acknowledgements", label: "Acknowledgements" },
    { path: "/quests", label: "Quests" },
    { path: "/item-combination", label: "Item Combination" },
    { path: "/farm", label: "Farm" },
  ];

  function handleDropDownVisibility() {
    setIsDropdownOpen(() => !isDropdownOpen);
  }

  return (
    <header className="h-16 w-full bg-[#3b2f24] text-[#f7e7d0] flex items-center justify-between px-6 shadow-md">
      {/* Logo / Title */}
      <h2 className="text-lg font-bold tracking-wide">Monster Hunter DB</h2>

      <nav className="flex gap-6 text-sm font-medium relative">
        {links.map((link) => (
          <Link
            className="hover:text-[#d0b38a] transition-colors"
            to={link.path}
            key={link.label}
          >
            {link.label}
          </Link>
        ))}
        <div
          className="relative"
          onClick={() => handleDropDownVisibility()}
          // onMouseEnter={() => handleDropDownVisibility(true)}
          // onMouseLeave={() => handleDropDownVisibility(false)}
        >
          <button
            className="hover:text-[#d0b38a] transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Others
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-1 bg-[#3b2f24] border border-[#d0b38a] rounded-md shadow-lg z-20 min-w-[150px]">
              {otherLinks.map((otherLinksItem) => (
                <Link
                  className="block px-4 py-2 hover:text-[#d0b38a]"
                  to={otherLinksItem.path}
                  key={otherLinksItem.label}
                >
                  {otherLinksItem.label}
                </Link>
              ))}
              <div className="p-2 text-xs text-gray-400">
                Other sections coming soon...
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
