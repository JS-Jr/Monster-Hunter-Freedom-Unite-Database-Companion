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
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <button
            className="hover:text-[#d0b38a] transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Others
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 bg-[#3b2f24] border border-[#d0b38a] rounded-md shadow-lg z-10 min-w-[150px]">
              {/* Placeholder for future navigation items */}
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
