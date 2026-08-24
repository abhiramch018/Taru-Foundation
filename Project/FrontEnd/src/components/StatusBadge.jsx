import React from 'react';

export const StatusBadge = ({ status, type = 'status' }) => {
  const s = String(status || '').toUpperCase();

  if (type === 'productType' || s === 'STANDARD' || s === 'UNIQUE') {
    if (s === 'UNIQUE' || s === 'UNIQUE PIECE') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 border border-amber-300">
          UNIQUE
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
        STANDARD
      </span>
    );
  }

  // Order & Product Statuses
  let colorClass = 'bg-gray-100 text-gray-800 border-gray-200';

  switch (s) {
    case 'APPROVED':
    case 'CONFIRMED':
    case 'DELIVERED':
    case 'PAID':
    case 'SUCCESS':
    case 'VERIFIED':
    case 'ACTIVE':
      colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      break;

    case 'PENDING':
    case 'PLACED':
    case 'PROCESSING':
    case 'HOLD IN ESCROW':
      colorClass = 'bg-amber-50 text-amber-800 border-amber-200';
      break;

    case 'SHIPPED':
    case 'IN-TRANSIT':
      colorClass = 'bg-blue-50 text-blue-800 border-blue-200';
      break;

    case 'REJECTED':
    case 'FAILED':
    case 'CANCELLED':
      colorClass = 'bg-red-50 text-red-800 border-red-200';
      break;

    case 'SOLD':
      colorClass = 'bg-purple-50 text-purple-800 border-purple-200';
      break;

    default:
      colorClass = 'bg-gray-100 text-gray-700 border-gray-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}
    >
      {s}
    </span>
  );
};
