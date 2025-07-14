import React from 'react';
import { UserPlus, Trash2 } from 'lucide-react';

const DriverManage = ({ drivers, handleDeleteDriver, showAddDriver, setShowAddDriver, driverForm, setDriverForm, handleAddDriver }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Driver Management</h2>
      <button
        onClick={() => setShowAddDriver(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        <UserPlus className="h-4 w-4" />
        <span>Add Driver</span>
      </button>
    </div>

    <div className="grid gap-4">
      {drivers.map(driver => (
        <div key={driver._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{driver.driverName}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-5 py-2 rounded-full text-sm font-semibold ${driver.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {driver.status === 'available' ? 'Available' : 'Assigned'}
              </span>
              <button
                onClick={() => handleDeleteDriver(driver._id)}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Delete driver"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">License Number</p>
              <p className="font-medium">{driver.licenseNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Age</p>
              <p className="font-medium">{driver.age} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{driver.phoneNo}</p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {showAddDriver && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Add New Driver</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Driver Name"
              value={driverForm.driverName}
              onChange={(e) => setDriverForm({ ...driverForm, driverName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Age"
              value={driverForm.age}
              onChange={(e) => setDriverForm({ ...driverForm, age: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={driverForm.phoneNo}
              onChange={(e) => setDriverForm({ ...driverForm, phoneNo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="License Number"
              value={driverForm.licenseNo}
              onChange={(e) => setDriverForm({ ...driverForm, licenseNo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleAddDriver}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Driver
            </button>
            <button
              onClick={() => setShowAddDriver(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default DriverManage;
