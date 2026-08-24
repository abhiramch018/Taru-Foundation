import React from 'react';
import { PackageOpen } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'There are no records to display at this moment.',
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl border border-taru-border/80 my-4 space-y-4">
      <div className="w-14 h-14 bg-taru-sand rounded-full flex items-center justify-center text-taru-dark">
        <Icon className="w-7 h-7" />
      </div>
      <div className="max-w-sm space-y-1">
        <h3 className="font-serif text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
