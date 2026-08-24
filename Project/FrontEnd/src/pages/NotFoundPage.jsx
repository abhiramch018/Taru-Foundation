import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 bg-taru-sand rounded-full flex items-center justify-center mx-auto text-taru-dark">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-taru-accent">
            404 — Page Not Found
          </span>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Lost on the Artisanal Path
          </h1>
          <p className="text-sm text-gray-500">
            The craft page or resource you are seeking has been relocated or does not exist.
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-taru-dark text-white rounded-full text-xs font-semibold hover:bg-taru-dark-hover shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
