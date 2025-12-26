export function DecorationDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto animate-pulse">
      {/* Title */}
      <div className="h-10 w-2/3 mx-auto rounded bg-[#D8C1A3]" />
      <div className="h-5 w-1/3 mx-auto mt-2 rounded bg-[#D8C1A3]" />

      {/* Divider */}
      <div className="mx-auto my-6 h-px w-2/3 bg-[#CBA986]" />

      {/* Main content */}
      <div className="mt-8 flex flex-col md:flex-row gap-8">
        {/* Image placeholder */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md h-64 rounded-xl bg-[#D8C1A3]" />
        </div>

        {/* Description / info */}
        <div className="flex-1 rounded-lg p-6 shadow bg-[#F7E7D0] space-y-4">
          <div className="h-6 w-1/2 rounded bg-[#D8C1A3]" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-[#D8C1A3]" />
            <div className="h-4 w-5/6 rounded bg-[#D8C1A3]" />
            <div className="h-4 w-4/6 rounded bg-[#D8C1A3]" />
          </div>
        </div>
      </div>

      {/* Extra sections */}
      <section className="mt-12 rounded-lg p-6 shadow bg-[#F7E7D0] space-y-4">
        <div className="h-6 w-1/3 rounded bg-[#D8C1A3]" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded p-4 shadow-sm bg-[#E9D3B4] space-y-2"
            >
              <div className="h-4 w-1/2 rounded bg-[#D8C1A3]" />
              <div className="h-4 w-2/3 rounded bg-[#D8C1A3]" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
