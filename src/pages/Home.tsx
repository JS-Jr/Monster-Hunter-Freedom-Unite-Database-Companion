export default function Home() {
  return (
    <div
      className="w-full min-h-[calc(100vh-4rem)]" // 4rem = header height (h-16)
      style={{ backgroundColor: "#E9D3B4" }}
    >
      {/* Background behind everything */}

      {/* HERO (full-width brown) */}
      <section
        aria-labelledby="hero-title"
        className="w-full py-16 sm:py-20 shadow-md text-center"
        style={{ backgroundColor: "#6B3E1B" }}
      >
        <h1
          id="hero-title"
          className="uppercase font-extrabold tracking-widest leading-tight"
          style={{ color: "#F7E7D0", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          MONSTER HUNTER
        </h1>

        <h1
          className="uppercase font-extrabold tracking-widest leading-tight"
          style={{ color: "#F7E7D0", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          FREEDOM UNITE
        </h1>

        <h3
          className="uppercase font-semibold tracking-wide mt-2"
          style={{ color: "#F7E7D0", fontSize: "clamp(1.2rem, 3vw, 1.8rem)" }}
        >
          DATABASE COMPANION
        </h3>

        {/* <div
          className="mx-auto my-6 h-px w-1/2"
          style={{ backgroundColor: "#CBA986" }}
        /> */}
      </section>

      {/* DESCRIPTION (full-width flesh) */}
      <section
        className="w-full py-12 px-6 sm:px-12 shadow-inner"
        style={{ backgroundColor: "#E9D3B4" }}
      >
        <p
          className="mx-auto max-w-4xl text-center text-lg sm:text-xl leading-relaxed"
          style={{ color: "#5A3F28" }}
        >
          A modern, interactive web app (React-based) that lets players explore
          detailed game data — weapons, armor, monsters, materials, and maps —
          with cross-referenced details, filters, and visual trees.
        </p>
      </section>
    </div>
  );
}
