import React from 'react';
import { FileText, History, Car, Users } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => (
  <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
    <button
      onClick={() => setActiveTab('active-requests')}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'active-requests'
        ? 'bg-white text-blue-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-800'
        }`}
    >
      <FileText className="h-4 w-4" />
      <span>Active Requests</span>
    </button>
    <button
      onClick={() => setActiveTab('past-requests')}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'past-requests'
        ? 'bg-white text-blue-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-800'
        }`}
    >
      <History className="h-4 w-4" />
      <span>Past Requests</span>
    </button>
    <button
      onClick={() => setActiveTab('vehicles')}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'vehicles'
        ? 'bg-white text-blue-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-800'
        }`}
    >
      <Car className="h-4 w-4" />
      <span>Vehicles</span>
    </button>
    <button
      onClick={() => setActiveTab('drivers')}
      className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'drivers'
        ? 'bg-white text-blue-600 shadow-sm'
        : 'text-gray-600 hover:text-gray-800'
        }`}
    >
      <Users className="h-4 w-4" />
      <span>Drivers</span>
    </button>
  </div>
);

export default Navbar;
