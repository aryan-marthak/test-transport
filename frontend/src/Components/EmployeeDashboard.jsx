import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthUser from '../context/AuthUser.jsx';
import { CarFront, LogOut, Plus, Eye, ArrowRight, Clock, CheckCircle, XCircle, SquareArrowOutDownRight } from 'lucide-react';

// Helper function to format dates as '7 July 2025'
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const SimpleEmployeeDashboard = () => {
  const navigate = useNavigate();
  const { logoutUser, authUser } = useAuthUser();
  const [activeTab, setActiveTab] = useState('requests');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [formData, setFormData] = useState({
    pickupPoint: '',
    destination: '',
    startDate: '',
    startTime: '',
    endDate: '',
    purpose: '',
    designation: '',
    vehicleClass: '',
    numberOfPassengers: '',
    remarks: ''
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/tripRequest', {
          credentials: 'include'
        });
        if (response.ok) {
          const requestsData = await response.json();
          setRequests(requestsData);
        }
      } catch (error) {
        console.log('Error fetching request: ', error);
      }
    };

    fetchRequests(); // Initial fetch

    const interval = setInterval(fetchRequests, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  

  const [requests, setRequests] = useState([]);

  const handleSubmit = async () => {
    if (formData.pickupPoint && formData.destination && formData.startDate && formData.startTime && formData.purpose && formData.designation && formData.vehicleClass && formData.numberOfPassengers) {
      try {
        const response = await fetch('http://localhost:5002/api/tripRequest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            ...formData,
            endDate: formData.endDate || formData.startDate, // Use start date if end date not provided
            remarks: formData.remarks || ''
          }),
        });

        if (response.ok) {
          const newRequest = await response.json();
          setRequests([newRequest, ...requests]);
          setFormData({
            pickupPoint: '',
            destination: '',
            startDate: '',
            startTime: '',
            endDate: '',
            purpose: '',
            designation: '',
            vehicleClass: '',
            numberOfPassengers: '',
            remarks: '',
          });
          setShowForm(false);
        } else {
          console.log('Failed to create trip request')
        }
      } catch (error) {
        console.log('Error creating trip request', error)
      }
    }
  };

  const handleViewDetails = (trip) => {
    setSelectedTrip(trip);
    setShowDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-sm';
      case 'Approved': return 'bg-green-100 text-green-800 border border-green-300 shadow-sm';
      case 'Rejected': return 'bg-red-100 text-red-800 border border-red-300 shadow-sm';
      case 'Completed': return 'bg-blue-100 text-blue-800 border border-blue-300 shadow-sm';
      default: return 'bg-gray-100 text-gray-800 border border-gray-300 shadow-sm';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'Approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const isRequestActive = (status) => {
    return status === 'Pending' || status === 'Approved';
  };

  const isRequestPast = (status) => {
    return status === 'Completed' || status === 'Rejected';
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      navigate('/login');
    }
  };

  // Separate active and past requests
  const activeRequests = requests.filter(request => isRequestActive(request.status));
  const pastRequests = requests.filter(request => isRequestPast(request.status));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Content */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Requests</h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              <span>New Request</span>
            </button>
          </div>
          
          {/* Active Requests Section */}
          {activeRequests.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-lg font-semibold text-gray-800">Active Requests</h3>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  {activeRequests.length}
                </span>
              </div>
              
              {activeRequests.map((request) => (
                <div key={request._id} className="bg-white rounded-lg shadow-md border-l-4 border-l-blue-500 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    {/* Trip Route */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 text-lg font-medium text-gray-800">
                        <span className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{request.pickupPoint}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <span className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>{request.destination}</span>
                        </span>
                        <span className="text-gray-500 text-sm">({request.purpose})</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1 flex items-center space-x-2">
                        <span>{formatDate(request.startDate)}</span>
                        <span>•</span>
                        <span>{request.startTime}</span>
                      </div>
                    </div>
                    
                    {/* Status and Actions */}
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Past Requests Section */}
          {pastRequests.length > 0 && (
            <div className="space-y-4 mt-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-600">Past Requests</h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
                  {pastRequests.length}
                </span>
              </div>
              
              {[...pastRequests]
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
                .map((request) => (
                  <div key={request._id} className="bg-gray-50 rounded-lg shadow-sm border p-6 opacity-60 hover:opacity-80 transition-all duration-300">
                    <div className="flex items-start justify-between">
                      {/* Trip Route */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 text-lg font-medium text-gray-600">
                          <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span>{request.pickupPoint}</span>
                          </span>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <span className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span>{request.destination}</span>
                          </span>
                          <span className="text-gray-500 text-sm">({request.purpose})</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
                          <span>{formatDate(request.startDate)}</span>
                          <span>•</span>
                          <span>{request.startTime}</span>
                          {request.endDate && (
                            <>
                              <span>•</span>
                              <span>Ended: {formatDate(request.endDate)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Status and Actions */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)} opacity-80`}>
                            {request.status}
                          </span>
                        </div>
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm font-medium hover:bg-gray-100 px-2 py-1 rounded transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Empty State */}
          {requests.length === 0 && (
            <div className="text-center py-12">
              <CarFront className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No requests yet</h3>
              <p className="text-gray-500">Create your first vehicle request to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* New Request Modal - Improved Design */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl">
            {/* Header - Fixed */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
              <h3 className="text-xl font-bold text-gray-800">New Vehicle Request</h3>
              <p className="text-sm text-gray-600 mt-1">Fill in the details below to request a vehicle</p>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location 
                </label>
                <input
                  type="text"
                  value={formData.pickupPoint}
                  onChange={(e) => setFormData({...formData, pickupPoint: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Where should we pick you up?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination 
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Where do you need to go?"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date 
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time 
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date 
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purpose 
                </label>
                <select
                  value={formData.purpose}
                  onChange={(e) => setFormData({...formData, purpose: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select purpose</option>
                  <option value="Official">Official</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                <select
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select your Designation</option>
                  <option value="Unit Head">Unit Head</option>
                  <option value="Functional Head">Functional Head</option>
                  <option value="Department Head">Department Head</option>
                  <option value="Sectional Head">Sectional Head</option>
                  <option value="Management">Management</option>
                  <option value="Staff">Staff</option>
                  <option value="Worker">Worker</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Class
                </label>
                <select
                  value={formData.vehicleClass}
                  onChange={(e) => setFormData({...formData, vehicleClass: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select vehicle class</option>
                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="Executive">Executive</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Passengers
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.numberOfPassengers}
                  onChange={(e) => setFormData({...formData, numberOfPassengers: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="How many passengers?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  rows="3"
                  placeholder="Any additional information..."
                />
              </div>

              </div>
            </div>
            
            {/* Footer - Fixed */}
            <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-xl">
              <div className="flex space-x-3">
                <button
                  onClick={handleSubmit}
                  disabled={!formData.pickupPoint || !formData.destination || !formData.startDate || !formData.startTime || !formData.purpose || !formData.designation || !formData.vehicleClass || !formData.numberOfPassengers }
                  className={`flex-1 py-2 rounded-md font-medium transition-all ${
                    !formData.pickupPoint || !formData.destination || !formData.startDate || !formData.startTime || !formData.purpose || !formData.designation || !formData.vehicleClass || !formData.numberOfPassengers  
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                  }`}
                >
                  Submit Request
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trip Details Modal */}
      {showDetails && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className={`${isRequestActive(selectedTrip.status) ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gradient-to-r from-gray-600 to-gray-700'} text-white p-4 rounded-t-lg`}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Trip Details</h3>
                  <p className={`${isRequestActive(selectedTrip.status) ? 'text-blue-100' : 'text-gray-100'} text-sm`}>Request ID: #{selectedTrip._id}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className={`p-4 ${isRequestPast(selectedTrip.status) ? 'opacity-75' : ''}`}>
              {/* Trip Route - Compact */}
              <div className={`${isRequestActive(selectedTrip.status) ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg p-3 mb-4`}>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">{selectedTrip.pickupPoint}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium">{selectedTrip.destination}</span>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    {getStatusIcon(selectedTrip.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTrip.status)}`}>
                      {selectedTrip.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid - Compact */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Purpose</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedTrip.purpose}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Vehicle Class</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedTrip.vehicleClass}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Number of Passengers</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedTrip.numberOfPassengers}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Start Date</label>
                    <p className="text-sm text-gray-900 font-medium">{formatDate(selectedTrip.startDate)}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
                    <p className="text-sm text-gray-900 font-medium">{selectedTrip.startTime}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">End Date</label>
                    <p className="text-sm text-gray-900 font-medium">{formatDate(selectedTrip.endDate) || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Details Section for Approved/Completed requests */}
              {selectedTrip.vehicleDetails && (selectedTrip.status === 'Approved' || selectedTrip.status === 'Completed') && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                    <CarFront className="h-4 w-4 mr-2" />
                    Vehicle Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Driver Name</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedTrip.vehicleDetails.driverName}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedTrip.vehicleDetails.phoneNo}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Vehicle Number</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedTrip.vehicleDetails.vehicleNo}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Vehicle Name</label>
                      <p className="text-sm text-gray-900 font-medium">{selectedTrip.vehicleDetails.vehicleName}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Remarks */}
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">Remarks</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedTrip.remarks || 'No remarks provided'}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 rounded-b-lg">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDetails(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  Close
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