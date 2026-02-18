import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="h-16 w-full bg-[#3b2f24] text-[#f7e7d0] flex items-center justify-between px-6 shadow-md">
      {/* Logo / Title */}
      <h2 className="text-lg font-bold tracking-wide">Monster Hunter DB</h2>

      {/* Nav links */}
      <nav className="flex gap-6 text-sm font-medium relative">
        <Link className="hover:text-[#d0b38a] transition-colors" to="/">
          Home
        </Link>
        <Link className="hover:text-[#d0b38a] transition-colors" to="/monsters">
          Monsters
        </Link>
        <Link className="hover:text-[#d0b38a] transition-colors" to="/armor">
          Armor
        </Link>
        <Link className="hover:text-[#d0b38a] transition-colors" to="/weapons">
          Weapons
        </Link>
        <Link className="hover:text-[#d0b38a] transition-colors" to="/maps">
          Maps
        </Link>
        <Link
          className="hover:text-[#d0b38a] transition-colors"
          to="/weapons/tree"
        >
          Weapon Tree
        </Link>
        <Link className="hover:text-[#d0b38a] transition-colors" to="/item">
          Item
        </Link>
        <Link
          className="hover:text-[#d0b38a] transition-colors"
          to="/decorations"
        >
          Decoration
        </Link>
        <Link className="hover:text-[#d0b38a] transition-colors" to="/skills">
          Skill
        </Link>
        <Link
          className="hover:text-[#d0b38a] transition-colors"
          to="/skill-builder"
        >
          Armor Skill Builder
        </Link>
        <Link className="hover:text-[#d0b38a] transition-colors" to="/status">
          Status/State
        </Link>
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
