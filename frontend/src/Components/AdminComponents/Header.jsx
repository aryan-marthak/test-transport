import React from 'react';
import { CarFront, LogOut } from 'lucide-react';

const Header = ({ authUser, handleLogout }) => (
  <nav className="bg-white shadow-sm border-b border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <CarFront className="h-8 w-8 text-blue-600 mr-3" />
          <span className="text-xl font-bold text-gray-800">Transport Management</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {authUser?.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
);

export default Header;
