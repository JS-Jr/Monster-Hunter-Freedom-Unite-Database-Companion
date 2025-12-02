import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "#1e293b",
        color: "white",
        padding: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h2>Monster Hunter DB</h2>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <Link to="/" style={{ color: "white" }}>Home</Link>
        <Link to="/monsters" style={{ color: "white" }}>Monsters</Link>
        <Link to="/armor" style={{ color: "white" }}>Armor</Link>
        <Link to="/weapons" style={{ color: "white" }}>Weapons</Link>
        <Link to="/maps" style={{ color: "white" }}>Maps</Link>
        <Link to="/weapons/tree" style={{ color: "white" }}>Weapon Tree</Link>
        <Link to="/item" style={{ color: "white" }}>Item</Link>
      </nav>
    </header>
  );
}
