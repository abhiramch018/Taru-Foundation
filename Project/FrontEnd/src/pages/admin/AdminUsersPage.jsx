import React, { useState } from 'react';
import { Search, Users, Shield, Store, ShoppingCart, Filter, Edit3, MoreVertical } from 'lucide-react';
import { StatusBadge } from '../../components/StatusBadge';

const SAMPLE_DIRECTORY = [
  {
    id: 'usr_1',
    name: 'Radha Women Weavers SHG',
    email: 'radha.phulia@taruartisans.org',
    role: 'seller',
    roleLabel: 'SELLER CO-OP',
    location: 'Phulia Village, West Bengal',
    activeSince: 'Oct 2024',
    metrics: '₹3.4L Sales',
    status: 'VERIFIED',
  },
  {
    id: 'usr_2',
    name: 'Vikram Singhania',
    email: 'v.singhania@hostemail.com',
    role: 'buyer',
    roleLabel: 'CONSCIOUS BUYER',
    location: 'South Mumbai, MH',
    activeSince: 'Jan 2025',
    metrics: '14 Orders',
    status: 'ACTIVE',
  },
  {
    id: 'usr_3',
    name: 'Lakshmi Handicrafts Collective',
    email: 'lakshmi.bagru@taruartisans.org',
    role: 'seller',
    roleLabel: 'SELLER CO-OP',
    location: 'Bagru Village, Rajasthan',
    activeSince: 'Nov 2024',
    metrics: '₹1.8L Sales',
    status: 'VERIFIED',
  },
  {
    id: 'usr_4',
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@gmail.com',
    role: 'buyer',
    roleLabel: 'CONSCIOUS BUYER',
    location: 'Pune, MH',
    activeSince: 'Feb 2025',
    metrics: '6 Orders',
    status: 'ACTIVE',
  },
  {
    id: 'usr_5',
    name: 'Central Platform Auditor',
    email: 'admin@tarufoundation.org',
    role: 'admin',
    roleLabel: 'SYSTEM ADMIN',
    location: 'New Delhi HQ',
    activeSince: 'Jan 2024',
    metrics: 'Superuser',
    status: 'VERIFIED',
  },
];

export const AdminUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredUsers = SAMPLE_DIRECTORY.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-taru-border">
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-900">User & SHG Directory</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Monitor community accounts, active craft makers, and consumer profiles.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user, village SHG..."
              className="pl-9 pr-3 py-2 bg-white border border-taru-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-taru-dark/20 focus:border-taru-dark shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-white border border-taru-border px-3 py-2 rounded-xl text-xs shadow-sm">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent font-semibold text-gray-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Role: All</option>
              <option value="seller">Sellers / SHGs</option>
              <option value="buyer">Buyers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-taru-border p-6 shadow-card space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[10px]">
                <th className="py-3 px-3">Artisan Coop / Customer Name</th>
                <th className="py-3 px-3">Email / ID</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Active Since</th>
                <th className="py-3 px-3">Metrics</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-taru-sand text-taru-dark font-serif font-bold flex items-center justify-center flex-shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{u.name}</p>
                        <p className="text-[11px] text-gray-400">{u.location}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-gray-600">{u.email}</td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'seller'
                          ? 'bg-amber-100 text-amber-900'
                          : u.role === 'admin'
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {u.roleLabel}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-gray-500">{u.activeSince}</td>
                  <td className="py-3.5 px-3 font-semibold text-gray-900">{u.metrics}</td>
                  <td className="py-3.5 px-3">
                    <StatusBadge status={u.status} />
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => alert(`Managing profile for ${u.name}`)}
                      className="text-xs font-semibold text-taru-dark hover:underline"
                    >
                      Edit Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
