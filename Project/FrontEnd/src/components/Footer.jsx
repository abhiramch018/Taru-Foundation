import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#f4f0e6] border-t border-taru-border pt-16 pb-12 mt-20 text-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-taru-dark flex items-center justify-center text-white font-serif text-lg font-bold">
                T
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-taru-dark">
                Taru Foundation
              </span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed font-normal">
              Connecting rural Self-Help Group (SHG) artisans directly with conscious global buyers to build self-sustaining livelihood ecosystems.
            </p>
            <div className="pt-2 flex items-center text-xs text-taru-accent font-medium space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Direct Village Revenue Flow</span>
            </div>
          </div>

          {/* Marketplace Col */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-taru-dark uppercase mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/products" className="text-gray-600 hover:text-taru-dark transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Handloom+Textiles" className="text-gray-600 hover:text-taru-dark transition-colors">
                  Handloom Textiles
                </Link>
              </li>
              <li>
                <Link to="/products?category=Organic+Foods" className="text-gray-600 hover:text-taru-dark transition-colors">
                  Organic Foods
                </Link>
              </li>
              <li>
                <Link to="/products?category=Handicrafts" className="text-gray-600 hover:text-taru-dark transition-colors">
                  Handicrafts & Pottery
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Mission Col */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-taru-dark uppercase mb-4">
              Our Mission
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#impact" className="text-gray-600 hover:text-taru-dark transition-colors">
                  Impact Report
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-600 hover:text-taru-dark transition-colors">
                  About Artisans
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-gray-600 hover:text-taru-dark transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#sustained-growth" className="text-gray-600 hover:text-taru-dark transition-colors">
                  Sustained Growth
                </a>
              </li>
            </ul>
          </div>

          {/* For Sellers Col */}
          <div>
            <h4 className="text-xs font-bold tracking-wider text-taru-dark uppercase mb-4">
              For Sellers
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/seller/onboarding" className="text-gray-600 hover:text-taru-dark transition-colors">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link to="/seller" className="text-gray-600 hover:text-taru-dark transition-colors">
                  SHG Guidelines
                </Link>
              </li>
              <li>
                <Link to="/seller" className="text-gray-600 hover:text-taru-dark transition-colors">
                  Craft Standards
                </Link>
              </li>
              <li>
                <Link to="/seller" className="text-gray-600 hover:text-taru-dark transition-colors">
                  Seller Hub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-taru-border/70 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Taru Foundation. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Preserving Indian rural artisanal heritage with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
