import React, { useState, useEffect } from 'react';
import useAuthUser from '../context/AuthUser.jsx';
import Header from './AdminComponents/Header.jsx';
import Navbar from './AdminComponents/Navbar.jsx';
import ActiveRequest from './AdminComponents/ActiveRequest.jsx';
import PastRequest from './AdminComponents/PastRequest.jsx';
import VehicleManage from './AdminComponents/VehicleManage.jsx';
import DriverManage from './AdminComponents/DriverManage.jsx';

const AdminDashboard = () => {
  const { logoutUser, authUser } = useAuthUser();
  const [activeTab, setActiveTab] = useState('active-requests');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [requests, setRequests] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [vehicleForm, setVehicleForm] = useState({
    vehicleNo: '',
    vehicleName: '',
    vehicleClass: '',
    capacity: '',
    vehicleColor: ''
  });
  const [driverForm, setDriverForm] = useState({
    driverName: '',
    age: '',
    phoneNo: '',
    licenseNo: ''
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignmentData, setAssignmentData] = useState({
    vehicleId: '',
    driverId: '',
    remarks: ''
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectRemark, setRejectRemark] = useState('');
  const [rejectingRequestId, setRejectingRequestId] = useState(null);

  // Utility for status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Helper for date formatting
  const formatDateLong = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Fetching and CRUD logic (same as before)
  const handleLogout = async () => {
    try {
      await logoutUser();
      window.location.href = '/login';
    } catch (error) {
      window.location.href = '/login';
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/drivers');
      if (response.ok) {
        const driversData = await response.json();
        setDrivers(driversData);
      }
    } catch (error) {}
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/vehicles');
      if (response.ok) {
        const vehiclesData = await response.json();
        setVehicles(vehiclesData);
      }
    } catch (error) {}
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/tripRequest', {
        credentials: 'include'
      });
      if (response.ok) {
        const requestsData = await response.json();
        setRequests(requestsData)
      }
    } catch (error) {}
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDrivers();
      fetchVehicles();
      fetchRequests();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // CRUD handlers for vehicles and drivers
  const handleAddVehicle = async () => {
    if (vehicleForm.vehicleNo && vehicleForm.vehicleName && vehicleForm.capacity && vehicleForm.vehicleClass && vehicleForm.vehicleColor) {
      try {
        const response = await fetch('http://localhost:5002/api/vehicles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vehicleNo: vehicleForm.vehicleNo,
            vehicleName: vehicleForm.vehicleName,
            vehicleClass: vehicleForm.vehicleClass,
            capacity: parseInt(vehicleForm.capacity),
            vehicleColor: vehicleForm.vehicleColor
          }),
        });
        if (response.ok) {
          const newVehicle = await response.json();
          setVehicles(prev => [...prev, newVehicle]);
          setVehicleForm({
            vehicleNo: '',
            vehicleName: '',
            vehicleClass: '',
            capacity: '',
            vehicleColor: ''
          });
          setShowAddVehicle(false);
        }
      } catch (error) {}
    }
  };

  const handleAddDriver = async () => {
    if (driverForm.driverName && driverForm.age && driverForm.phoneNo && driverForm.licenseNo) {
      try {
        const response = await fetch('http://localhost:5002/api/drivers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            driverName: driverForm.driverName,
            age: parseInt(driverForm.age),
            phoneNo: driverForm.phoneNo,
            licenseNo: driverForm.licenseNo,
            status: 'available'
          }),
        });
        if (response.ok) {
          const newDriver = await response.json();
          setDrivers(prev => [...prev, newDriver]);
          setDriverForm({
            driverName: '',
            age: '',
            phoneNo: '',
            licenseNo: ''
          });
          setShowAddDriver(false);
        }
      } catch (error) {}
    }
  };

  const handleDeleteDriver = async (driverId) => {
    if (window.confirm('Are you sure you want to delete this driver?')) {
      try {
        const response = await fetch(`http://localhost:5002/api/drivers/${driverId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setDrivers(prev => prev.filter(driver => driver._id !== driverId));
        }
      } catch (error) {}
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const response = await fetch(`http://localhost:5002/api/vehicles/${vehicleId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setVehicles(prev => prev.filter(vehicle => vehicle._id !== vehicleId));
        }
      } catch (error) {}
    }
  };

  // Assignment and rejection logic
  const handleApprove = async (requestId, vehicleId, driverId, remarks) => {
    try {
      const response = await fetch(`http://localhost:5002/api/tripRequest/${requestId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ vehicleId, driverId, remarks })
      });
      if (response.ok) {
        setSelectedRequest(null);
        setAssignmentData({ vehicleId: '', driverId: '', remarks: '' });
      } else {
        alert('Failed to approve and assign. Please try again.')
      }
    } catch (error) {
      alert('Error approving and assigning request.')
    }
    await fetchDrivers();
    await fetchVehicles();
    setSelectedRequest(null);
    setAssignmentData({ vehicleId: '', driverId: '', remarks: '' });
  };

  const handleReject = async (requestId, reason) => {
    setRejectingRequestId(requestId);
    setRejectRemark('');
    setShowRejectModal(true);
  };

  const submitReject = async () => {
    if (!rejectingRequestId) return;
    try {
      const response = await fetch(`http://localhost:5002/api/tripRequest/${rejectingRequestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ remarks: rejectRemark })
      });
      if (response.ok) {
        setShowRejectModal(false);
        setRejectRemark('');
        setRejectingRequestId(null);
        setRequests(prev => prev.map(req => req._id === rejectingRequestId ? { ...req, status: 'Rejected', remarks: rejectRemark } : req));
      } else {
        setShowRejectModal(false);
        setRejectRemark('');
        setRejectingRequestId(null);
      }
    } catch (error) {
      setShowRejectModal(false);
      setRejectRemark('');
      setRejectingRequestId(null);
    }
  };

  const handleCompleteTrip = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5002/api/tripRequest/${requestId}/complete`, {
        method: 'POST',
        credentials: 'include',
        header: { "Content-Type": "application/json" }
      });
      if (response.ok) {
        fetchRequests();
      } else {
        alert('Failed to complete the trip')
      }
    } catch (error) {
      alert('Error completing the trip')
    }
  };

  // Helpers for assignment modal
  const getAvailableVehicles = (requestedClass) => {
    return vehicles.filter(vehicle =>
      vehicle.vehicleClass === requestedClass &&
      vehicle.status === 'Available' &&
      !vehicle.outOfService
    );
  };
  const getAvailableDrivers = () => {
    return drivers.filter(driver => driver.status === 'available');
  };

  // Split requests
  const activeRequests = requests.filter(req => req.status === 'Pending');
  const pastRequests = requests.filter(req => req.status !== 'Pending');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header authUser={authUser} handleLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        <div className="tab-content">
          {activeTab === 'active-requests' && (
            <ActiveRequest
              activeRequests={activeRequests}
              getStatusColor={getStatusColor}
              setSelectedRequest={setSelectedRequest}
              handleReject={handleReject}
            />
          )}
          {activeTab === 'past-requests' && (
            <PastRequest
              pastRequests={pastRequests}
              getStatusColor={getStatusColor}
              formatDateLong={formatDateLong}
              handleCompleteTrip={handleCompleteTrip}
            />
          )}
          {activeTab === 'vehicles' && (
            <VehicleManage
              vehicles={vehicles}
              handleDeleteVehicle={handleDeleteVehicle}
              showAddVehicle={showAddVehicle}
              setShowAddVehicle={setShowAddVehicle}
              vehicleForm={vehicleForm}
              setVehicleForm={setVehicleForm}
              handleAddVehicle={handleAddVehicle}
            />
          )}
          {activeTab === 'drivers' && (
            <DriverManage
              drivers={drivers}
              handleDeleteDriver={handleDeleteDriver}
              showAddDriver={showAddDriver}
              setShowAddDriver={setShowAddDriver}
              driverForm={driverForm}
              setDriverForm={setDriverForm}
              handleAddDriver={handleAddDriver}
            />
          )}
        </div>
      </div>
      {/* Assignment Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Approve & Assign Vehicle</h3>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Request Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Employee:</span>
                  <span className="ml-2 font-medium">{selectedRequest.createdBy?.name || 'Employee'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Employee ID:</span>
                  <span className="ml-2 font-medium">{selectedRequest.createdBy?.employeeId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Designation:</span>
                  <span className="ml-2 font-medium">{selectedRequest.designation}</span>
                </div>
                <div>
                  <span className="text-gray-600">Purpose:</span>
                  <span className="ml-2 font-medium">{selectedRequest.purpose}</span>
                </div>
                <div>
                  <span className="text-gray-600">Pickup Point:</span>
                  <span className="ml-2 font-medium">{selectedRequest.pickupPoint}</span>
                </div>
                <div>
                  <span className="text-gray-600">Destination:</span>
                  <span className="ml-2 font-medium">{selectedRequest.destination}</span>
                </div>
                <div>
                  <span className="text-gray-600">Start Date:</span>
                  <span className="ml-2 font-medium">{formatDateLong(selectedRequest.startDate)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Start Time:</span>
                  <span className="ml-2 font-medium">{selectedRequest.startTime}</span>
                </div>
                <div>
                  <span className="text-gray-600">End Date:</span>
                  <span className="ml-2 font-medium">{formatDateLong(selectedRequest.endDate)}</span>
                </div>
                <div>
                  <span className="text-gray-600">No. of Passengers:</span>
                  <span className="ml-2 font-medium">{selectedRequest.numberOfPassengers}</span>
                </div>
                <div>
                  <span className="text-gray-600">Required Vehicle Class:</span>
                  <span className="ml-2 font-medium">{selectedRequest.vehicleClass}</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {/* Vehicle Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Vehicle ({selectedRequest.vehicleClass})
                </label>
                <select
                  value={assignmentData.vehicleId}
                  onChange={(e) => setAssignmentData({ ...assignmentData, vehicleId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a vehicle</option>
                  {getAvailableVehicles(selectedRequest.vehicleClass).map(vehicle => (
                    <option key={vehicle._id} value={vehicle._id}>
                      {vehicle.vehicleNo} - {vehicle.vehicleName} ({vehicle.capacity} seats)
                    </option>
                  ))}
                </select>
              </div>
              {/* Driver Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Driver
                </label>
                <select
                  value={assignmentData.driverId}
                  onChange={(e) => setAssignmentData({ ...assignmentData, driverId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a driver</option>
                  {getAvailableDrivers().map(driver => (
                    <option key={driver._id} value={driver._id}>
                      {driver.driverName} - {driver.phoneNo}
                    </option>
                  ))}
                </select>
              </div>
              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={assignmentData.remarks}
                  onChange={(e) => setAssignmentData({ ...assignmentData, remarks: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional notes or instructions..."
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => handleApprove(
                  selectedRequest._id,
                  assignmentData.vehicleId,
                  assignmentData.driverId,
                  assignmentData.remarks
                )}
                disabled={!assignmentData.vehicleId || !assignmentData.driverId}
                className={`flex-1 py-2 rounded-md transition-colors ${!assignmentData.vehicleId || !assignmentData.driverId
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
              >
                Approve & Assign
              </button>
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setAssignmentData({ vehicleId: '', driverId: '', remarks: '' });
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Reject Request</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection</label>
            <textarea
              value={rejectRemark}
              onChange={e => setRejectRemark(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Please provide a reason for rejection..."
            />
            <div className="flex space-x-3 mt-6">
              <button
                onClick={submitReject}
                disabled={!rejectRemark.trim()}
                className={`flex-1 py-2 rounded-md transition-colors ${!rejectRemark.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                Reject
              </button>
              <button
                onClick={() => { setShowRejectModal(false); setRejectRemark(''); setRejectingRequestId(null); }}
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
};

export default AdminDashboard;