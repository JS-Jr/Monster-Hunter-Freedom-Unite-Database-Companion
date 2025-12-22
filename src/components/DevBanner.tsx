import { useState } from "react";

export default function DevBanner() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`
        overflow-hidden w-full
        transition-[max-height,opacity] duration-500 ease-in-out
        ${open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}
      `}
    >
      <div
        className="bg-[#F3E8DC] text-[#5A3F28] text-center text-sm flex flex-col items-center justify-center gap-1 py-3 px-4 select-none
                   cursor-default"
      >
        <div className="text-xl mb-1">(*^‿^*)/</div>
        <span className="font-semibold">
          ⚠️ Heads up: This site is a work in progress.
        </span>
        <span className="text-xs opacity-70">
          Things may change or break occasionally ¯\_(ツ)_/¯
        </span>
        <button
          onClick={() => setOpen(false)}
          className="mt-2 text-[#5A3F28] bg-[#E0C8A0] px-3 py-1 rounded font-mono opacity-80
                     hover:opacity-100 hover:scale-105 transition-transform cursor-pointer"
          aria-label="Close dev banner"
        >
          ✕ Close
        </button>
      </div>
    </div>
  );
}
