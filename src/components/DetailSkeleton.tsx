import React from "react";

export const DetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-start animate-pulse">
      <div className="w-2/3 h-8 bg-[#CBA986] rounded mb-4" />
      <div className="w-1/2 h-6 bg-[#D6B999] rounded mb-8" />

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl">
        {/* Image placeholder */}
        <div className="flex-1 h-64 md:h-80 bg-[#D6B999] rounded shadow" />

        {/* Description placeholder */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-6 bg-[#D6B999] rounded w-1/2" />
          <div className="h-4 bg-[#E9D3B4] rounded w-full" />
          <div className="h-4 bg-[#E9D3B4] rounded w-full" />
          <div className="h-4 bg-[#E9D3B4] rounded w-3/4" />
        </div>
      </div>

      <div className="mt-12 w-2/3 h-4 bg-[#D6B999] rounded" />
    </div>
  );
};
