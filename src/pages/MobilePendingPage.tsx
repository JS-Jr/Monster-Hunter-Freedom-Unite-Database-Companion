import React from "react";

export const MobilePendingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#E9D3B4] text-center">
      <div className="text-6xl mb-4">(ﾉ≧ڡ≦)☆</div>
      <h1 className="text-3xl font-bold text-[#5A3F28] mb-2">
        Mobile layout? Pfft… maybe one day ¯\_(ツ)_/¯
      </h1>
      <p className="text-[#5A3F28] opacity-80 max-w-md">
        This page is secretly a big screen snob (¬‿¬). Please visit on a tablet,
        laptop, or desktop for peak awesomeness. <br />
        <br />
        Feeling generous? Your donation could bribe the layout gods (づ｡◕‿‿◕｡)づ
      </p>
    </div>
  );
};
