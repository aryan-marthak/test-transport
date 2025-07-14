import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthUser from '../context/AuthUser.jsx';
import Header from './AdminComponents/Header.jsx';
import ActiveRequest from './EmployeeComponents/ActiveRequest.jsx';
import PastRequest from './EmployeeComponents/PastRequest.jsx';
import NewRequest from './EmployeeComponents/NewRequest.jsx';
import { CarFront, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';

// Helper function to format dates as '7 July 2025'
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { logoutUser, authUser } = useAuthUser();
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
  const [requests, setRequests] = useState([]);

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
    fetchRequests();
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, []);

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
            endDate: formData.endDate || formData.startDate,
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

  const isRequestActive = (status) => status === 'Pending' || status === 'Approved';
  const isRequestPast = (status) => status === 'Completed' || status === 'Rejected';

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      navigate('/login');
    }
  };

  // Split requests
  const activeRequests = requests.filter(request => isRequestActive(request.status));
  const pastRequests = requests.filter(request => isRequestPast(request.status));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header authUser={authUser} handleLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Requests</h2>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              {/* Plus icon can be added here if desired */}
              <span>New Request</span>
            </button>
          </div>
          {/* New Request Modal */}
          <NewRequest
            showForm={showForm}
            setShowForm={setShowForm}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
          />
          {/* Active Requests Section */}
          {activeRequests.length > 0 && (
            <ActiveRequest
              activeRequests={activeRequests}
              onViewDetails={handleViewDetails}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              formatDate={formatDate}
            />
          )}
          {/* Past Requests Section */}
          {pastRequests.length > 0 && (
            <PastRequest
              pastRequests={pastRequests}
              onViewDetails={handleViewDetails}
              getStatusColor={getStatusColor}
              getStatusIcon={getStatusIcon}
              formatDate={formatDate}
            />
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

export default EmployeeDashboard;