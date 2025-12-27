// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg">Page not found</p>
      <Link to="/" className="mt-4 text-[#5A3F28] hover:underline">
        Go home
      </Link>
    </div>
  );
}
