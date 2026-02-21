export default function Acknowledgements() {
  return (
    <div
      className="w-full min-h-[calc(100vh-4rem)]" // 4rem = header height (h-16)
      style={{ backgroundColor: "#E9D3B4" }}
    >
      {/* HERO (full-width brown) */}
      <section
        aria-labelledby="acknowledgements-title"
        className="w-full py-16 sm:py-20 shadow-md text-center"
        style={{ backgroundColor: "#6B3E1B" }}
      >
        <h1
          id="acknowledgements-title"
          className="uppercase font-extrabold tracking-widest leading-tight"
          style={{ color: "#F7E7D0", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
        >
          ACKNOWLEDGEMENTS
        </h1>
      </section>

      {/* CONTENT (full-width flesh) */}
      <section
        className="w-full py-12 px-6 sm:px-12 shadow-inner"
        style={{ backgroundColor: "#E9D3B4" }}
      >
        <div className="mx-auto max-w-4xl">
          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: "#5A3F28" }}
          >
            Inspirations
          </h2>
          <p
            className="text-lg leading-relaxed mb-8"
            style={{ color: "#5A3F28" }}
          >
            This project was inspired by various sources and individuals. Add your acknowledgements here.
          </p>
          <ul
            className="list-disc list-inside mb-8 space-y-2"
            style={{ color: "#5A3F28" }}
          >
            <li>
              <a
                href="#"
                className="underline hover:no-underline"
                style={{ color: "#6B3E1B" }}
              >
                Example GitHub User
              </a>{" "}
              - Description of inspiration.
            </li>
            <li>
              <a
                href="#"
                className="underline hover:no-underline"
                style={{ color: "#6B3E1B" }}
              >
                Example Site
              </a>{" "}
              - Description.
            </li>
            {/* Add more as needed */}
          </ul>

          <h2
            className="text-2xl font-bold mb-6"
            style={{ color: "#5A3F28" }}
          >
            Data Sources
          </h2>
          <p
            className="text-lg leading-relaxed mb-8"
            style={{ color: "#5A3F28" }}
          >
            Data was extracted from various sources. Acknowledge them here.
          </p>
          <ul
            className="list-disc list-inside mb-8 space-y-2"
            style={{ color: "#5A3F28" }}
          >
            <li>
              <a
                href="#"
                className="underline hover:no-underline"
                style={{ color: "#6B3E1B" }}
              >
                Example Wiki or Database
              </a>{" "}
              - Description of data extracted.
            </li>
            {/* Add more as needed */}
          </ul>
        </div>
      </section>
    </div>
  );
}