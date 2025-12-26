import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="h-16 w-full bg-[#3b2f24] text-[#f7e7d0] flex items-center justify-between px-6 shadow-md">
      {/* Logo / Title */}
      <h2 className="text-lg font-bold tracking-wide">Monster Hunter DB</h2>

      {/* Nav links */}
      <nav className="flex gap-6 text-sm font-medium">
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
      </nav>
    </header>
  );
}
