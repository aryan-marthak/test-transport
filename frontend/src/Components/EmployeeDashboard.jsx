import React, { useState } from 'react';
import { Car, Plus, FileText, User } from 'lucide-react';

const SimpleEmployeeDashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    time: '',
    purpose: ''
  });

  const [requests, setRequests] = useState([
    {
      id: 1,
      destination: 'Airport',
      date: '2024-06-15',
      time: '09:00',
      purpose: 'Official',
      status: 'Completed'
    },
    {
      id: 2,
      destination: 'Client Office',
      date: '2024-06-10',
      time: '14:00',
      purpose: 'Meeting',
      status: 'Completed'
    },
    {
      id: 3,
      destination: 'Conference Center',
      date: '2024-06-08',
      time: '10:30',
      purpose: 'Official',
      status: 'Completed'
    },
    {
      id: 4,
      destination: 'Hospital',
      date: '2024-06-05',
      time: '16:00',
      purpose: 'Emergency',
      status: 'Rejected'
    },
    {
      id: 5,
      destination: 'Railway Station',
      date: '2024-06-01',
      time: '07:30',
      purpose: 'Personal',
      status: 'Completed'
    }
  ]);

  const handleSubmit = () => {
    if (formData.destination && formData.date && formData.time) {
      const newRequest = {
        id: requests.length + 1,
        ...formData,
        status: 'Pending'
      };
      setRequests([newRequest, ...requests]);
      setFormData({ destination: '', date: '', time: '', purpose: '' });
      setShowForm(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">Vehicle Requests</h1>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-8 w-8 bg-blue-600 text-white rounded-full p-2" />
            <span className="font-medium">John Doe</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Requests</h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>New Request</span>
            </button>
          </div>
          
          {requests.map(request => (
            <div key={request.id} className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{request.destination}</h3>
                  <p className="text-sm text-gray-600">
                    {request.date} at {request.time}
                  </p>
                  <p className="text-sm text-gray-600">{request.purpose}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">New Vehicle Request</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination *
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Where do you need to go?"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose *
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select purpose</option>
                  <option value="Official">Official</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Personal">Personal</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="flex space-x-2 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!formData.destination || !formData.date || !formData.time}
                  className={`flex-1 py-2 rounded-md font-medium ${
                    !formData.destination || !formData.date || !formData.time
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleEmployeeDashboard;