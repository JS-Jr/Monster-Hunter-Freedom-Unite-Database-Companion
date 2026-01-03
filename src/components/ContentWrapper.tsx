import React, { type ReactNode } from "react";

type ContentWrapperProps = {
  children: ReactNode;
  className?: string;
};

const ContentWrapper: React.FC<ContentWrapperProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={`p-4 min-h-[calc(100vh-4rem)] bg-[#E9D3B4] text-[#5A3F28] ${className}`}
    >
      {children}
    </div>
  );
};

export default ContentWrapper;
