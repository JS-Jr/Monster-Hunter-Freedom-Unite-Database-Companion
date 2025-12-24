export default function WeaponSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28] p-6 animate-pulse">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="h-12 bg-[#D6B99A] mb-2 w-3/4 rounded"></div>
        <div className="h-6 bg-[#D6B99A] mb-8 w-1/3 rounded"></div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="h-6 bg-[#D6B99A] rounded"></div>
          <div className="h-6 bg-[#D6B99A] rounded"></div>
          <div className="h-6 bg-[#D6B99A] rounded"></div>
          <div className="h-6 bg-[#D6B99A] rounded"></div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <div className="h-4 bg-[#D6B99A] w-1/4 rounded"></div>
          <div className="h-4 bg-[#D6B99A] w-1/2 rounded"></div>
          <div className="h-4 bg-[#D6B99A] w-1/3 rounded"></div>
        </div>
      </div>
    </div>
  );
}
