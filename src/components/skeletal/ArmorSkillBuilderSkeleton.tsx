import ContentWrapperProps from "../ContentWrapper";

export function ArmorSkillBuilderSkeleton() {
  return (
    <ContentWrapperProps>
      <div className="max-w-5xl mx-auto px-4 py-8 text-[#5A3F28] animate-pulse">
        {/* Title */}
        <div className="h-10 w-64 bg-[#CBA986] rounded mx-auto mb-6"></div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto mb-8">
          <table className="w-full bg-[#F7E7D0] rounded-lg shadow border-collapse">
            <thead>
              <tr className="bg-[#E9D3B4] text-left">
                {["Type", "Selection / Actions", "Defense", "Skills"].map(
                  (h) => (
                    <th key={h} className="px-4 py-3">
                      <span className="block h-4 bg-[#CBA986] rounded"></span>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <tr key={i} className="border-t border-[#CBA986]">
                    {Array(4)
                      .fill(0)
                      .map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <span className="block h-4 bg-[#E9D3B4] rounded mb-2"></span>
                          {j === 3 && (
                            <div className="flex flex-wrap gap-1">
                              {Array(2)
                                .fill(0)
                                .map((_, k) => (
                                  <span
                                    key={k}
                                    className="h-3 w-12 bg-[#E9D3B4] rounded"
                                  ></span>
                                ))}
                            </div>
                          )}
                        </td>
                      ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Totals Skeleton */}
        <section className="bg-[#F7E7D0] rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-40 bg-[#CBA986] rounded"></div>
            <div className="h-6 w-24 bg-[#CBA986] rounded"></div>
          </div>

          <div className="mb-4">
            <div className="h-4 w-32 bg-[#E9D3B4] rounded mb-2"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="h-6 w-full bg-[#E9D3B4] rounded"></div>
              ))}
          </div>
        </section>
      </div>
    </ContentWrapperProps>
  );
}
