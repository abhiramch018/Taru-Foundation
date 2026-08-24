import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = 'emerald' }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-taru-border/80 shadow-card flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="font-serif text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 font-medium">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="p-3 bg-taru-sand rounded-xl text-taru-dark flex-shrink-0">
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
