import React from "react";

const LoadingComponent: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600"></div>
    <p className="mt-4 text-zinc-600">読み込み中...</p>
  </div>
  );
};

export default LoadingComponent;
