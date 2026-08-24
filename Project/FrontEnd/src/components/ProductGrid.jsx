import React from 'react';
import { ProductCard } from './ProductCard';

export const ProductGrid = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-2xl border border-taru-border p-8">
        <p className="text-gray-500 text-sm">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
