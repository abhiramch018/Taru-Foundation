import React from 'react';

export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-3">
      <div className="w-10 h-10 border-4 border-taru-sand border-t-taru-dark rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-gray-500">{text}</p>
    </div>
  );
};
