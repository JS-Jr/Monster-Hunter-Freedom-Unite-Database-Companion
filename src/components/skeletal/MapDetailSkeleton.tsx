export function MapDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Title */}
      {/* <div className="h-10 w-64 mx-auto mb-6 rounded bg-[#DCC4A8] animate-pulse" /> */}

      {/* <div className="my-6 h-px bg-[#CBA986]" /> */}

      <div className="flex justify-center lg:justify-start gap-6 lg:gap-8 flex-col lg:flex-row">
        {/* MAP SKELETON */}
        <div className="rounded-lg overflow-hidden shadow flex-shrink-0">
          <div className="h-[750px] w-[750px] bg-[#DCC4A8] animate-pulse" />
        </div>

        {/* SIDEBAR SKELETON */}
        <div className="flex-1 bg-[#F7E7D0] rounded-lg p-6 shadow max-h-[750px] overflow-y-auto">
          {/* Sidebar title */}
          <div className="h-7 w-48 mb-4 rounded bg-[#DCC4A8] animate-pulse" />

          {/* Search input */}
          <div className="h-10 w-full mb-4 rounded bg-[#E6D2B8] animate-pulse" />

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            <div className="h-10 flex-1 rounded bg-[#E6D2B8] animate-pulse" />
            <div className="h-10 flex-1 rounded bg-[#E6D2B8] animate-pulse" />
          </div>

          {/* Node list skeleton */}
          <ul className="space-y-4">
            {[...Array(5)].map((_, areaIndex) => (
              <li key={areaIndex}>
                {/* Area name */}
                <div className="h-5 w-40 mb-3 rounded bg-[#DCC4A8] animate-pulse" />

                <ul className="space-y-2 ml-3">
                  {[...Array(3)].map((_, nodeIndex) => (
                    <li
                      key={nodeIndex}
                      className="h-4 w-full rounded bg-[#E6D2B8] animate-pulse"
                    />
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
