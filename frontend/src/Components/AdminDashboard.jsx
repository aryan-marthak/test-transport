import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthUser from '../context/AuthUser.jsx';
import {
  Users,
  User,
  Car,
  FileText,
  History,
  Plus,
  Edit,
  Check,
  X,
  Eye,
  LogOut,
  UserPlus,
  CarFront,
  Trash2,
  MapPin,
  Calendar
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuthUser();
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
        setAssignmentData({ vehicleId: '', driverId:'', remarks: '' } );
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
        // Optionally, you can refetch requests here or rely on polling
        setShowRejectModal(false);
        setRejectRemark('');
        setRejectingRequestId(null);
        // Optionally, update requests state immediately for snappier UI
        setRequests(prev => prev.map(req => req._id === rejectingRequestId ? { ...req, status: 'Rejected', remarks: rejectRemark } : req));
      } else {
        // handle error
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

  const getAvailableVehicles = (requestedClass) => {
    return vehicles.filter(vehicle =>
      vehicle.vehicleClass === requestedClass
    );
  };

  const getAvailableDrivers = () => {
    return drivers.filter(driver => driver.status === 'available');
  };

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
        } else {
          console.error('Failed to add vehicle');
        }
      } catch (error) {
        console.error('Error adding vehicle:', error);
      }
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
        } else {
          console.error('Failed to add driver');
        }
      } catch (error) {
        console.error('Error adding driver:', error);
      }
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
        } else {
          console.error('Failed to delete driver');
        }
      } catch (error) {
        console.error('Error deleting driver:', error);
      }
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
        } else {
          console.error('Failed to delete vehicle');
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, redirect to login
      navigate('/login');
    }
  };

  // Fetch drivers, vehicles and tripRequests from server
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/drivers');
        if (response.ok) {
          const driversData = await response.json();
          setDrivers(driversData);
        } else {
          console.error('Failed to fetch drivers');
        }
      } catch (error) {
        console.error('Error fetching drivers: ', error);
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/vehicles');
        if (response.ok) {
          const vehiclesData = await response.json();
          setVehicles(vehiclesData);
        } else {
          console.error('Failed to fetch vehicles');
        }
      } catch (error) {
        console.error('Error fetching vehicles: ', error);
      }
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
      } catch (error) {
        console.log('Error fetching request: ', error)
      }
    };

    const interval = setInterval(() => {
      fetchDrivers();
      fetchVehicles();
      fetchRequests()
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Helper: split requests by status
  const activeRequests = requests.filter(req => req.status === 'Pending');
  const pastRequests = requests.filter(req => req.status !== 'Pending');

  // Helper for date formatting
  const formatDateLong = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const renderActiveRequests = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Vehicle Requests</h2>
      {activeRequests.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No active requests found</p>
        </div>
      ) : (
        activeRequests.map(request => (
          <div key={request._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-fit">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {request.createdBy?.name || 'Employee'} <span className="text-gray-600 font-normal">({request.designation})</span>
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-bold text-gray-700">
                        {request.createdBy.employeeId}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-5 py-3 rounded-full text-md font-semibold border border-gray-400 ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {/* Trip Details */}
              <div className="space-y-4">
                {/* Purpose */}
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Purpose</p>
                    <p className="text-sm font-semibold text-gray-900">{request.purpose}</p>
                  </div>
                </div>

                {/* Pickup and Destination */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">Pickup Point</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{request.pickupPoint}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">Destination</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{request.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Pickup Date & Time and End Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">Pickup Date & Time</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDateLong(request.startDate)} at {request.startTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">End Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDateLong(request.endDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Passengers and Vehicle */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-cyan-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">No. of Passengers</p>
                      <p className="text-sm font-semibold text-gray-900">{request.numberOfPassengers}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-teal-100 p-2 rounded-lg">
                      <Car className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">Requested Vehicle</p>
                      <p className="text-sm font-semibold text-gray-900">{request.vehicleClass}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {request.status === 'Pending' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm text-sm flex-1"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve & Assign</span>
                  </button>
                  <button
                    onClick={() => handleReject(request._id, '')}
                    className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm flex-1"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderPastRequests = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Past Handled Requests</h2>
      {pastRequests.length === 0 ? (
        <div className="text-center py-12">
          <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No past requests found</p>
        </div>
      ) : (
        pastRequests.map(request => (
          <div key={request._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-fit">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {request.createdBy?.name || 'Employee'} <span className="text-gray-600 font-normal">({request.designation})</span>
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-bold text-gray-700">
                        {request.createdBy?.employeeId}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-5 py-3 rounded-full text-md font-semibold border border-gray-400 ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {/* Trip Details */}
              <div className="space-y-4">
                {/* Purpose */}
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500">Purpose</p>
                    <p className="text-sm font-semibold text-gray-900">{request.purpose}</p>
                  </div>
                </div>

                {/* Pickup and Destination */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">Pickup Point</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{request.pickupPoint}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <MapPin className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">Destination</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{request.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Pickup Date & Time and End Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">Pickup Date & Time</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDateLong(request.startDate)} at {request.startTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">End Date</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDateLong(request.endDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Passengers and Vehicle */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-cyan-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">No. of Passengers</p>
                      <p className="text-sm font-semibold text-gray-900">{request.numberOfPassengers}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-teal-100 p-2 rounded-lg">
                      <Car className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500">Requested Vehicle</p>
                      <p className="text-sm font-semibold text-gray-900">{request.vehicleClass}</p>
                    </div>
                  </div>
                </div>

                {/* Assigned Vehicle/Driver */}
                {request.vehicleDetails && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Assigned Vehicle</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {request.vehicleDetails.vehicleNo} - {request.vehicleDetails.vehicleName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Assigned Driver</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {request.vehicleDetails.driverName} ({request.vehicleDetails.phoneNo})
                      </p>
                    </div>
                  </div>
                )}

                {/* Remarks */}
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Remarks</label>
                  <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{request.remarks || 'No remarks provided'}</p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  const renderVehicles = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vehicle Management</h2>
        <button
          onClick={() => setShowAddVehicle(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      <div className="grid gap-4">
        {vehicles.map(vehicle => (
          <div key={vehicle._id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{vehicle.vehicleNo}</h3>
                <p className="text-sm text-gray-600">{vehicle.vehicleName}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-5 py-2 rounded-full text-sm font-semibold ${vehicle.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {vehicle.status === 'assigned' ? 'Assigned' : "Available"}
                </span>
                <button
                  onClick={() => handleDeleteVehicle(vehicle._id)}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Delete vehicle"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium">{vehicle.vehicleClass}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="font-medium">{vehicle.capacity} seats</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Color</p>
                <p className="font-medium">{vehicle.vehicleColor}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDrivers = () => (
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
                <span className={`px-5 py-2 rounded-full text-sm font-semibold ${driver.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
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
              {/* <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{driver.status === 'available' ? 'Available' : 'Assigned'}</p>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
              <span className="text-gray-700">Welcome, Admin</span>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
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
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'active-requests' && renderActiveRequests()}
          {activeTab === 'past-requests' && renderPastRequests()}
          {activeTab === 'vehicles' && renderVehicles()}
          {activeTab === 'drivers' && renderDrivers()}
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
      {showAddVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Vehicle</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Vehicle Number"
                value={vehicleForm.vehicleNo}
                onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleNo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Vehicle Name"
                value={vehicleForm.vehicleName}
                onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={vehicleForm.vehicleClass}
                onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleClass: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Class</option>
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
                <option value="Executive">Executive</option>
                <option value="Luxury">Luxury</option>
              </select>
              <input
                type="number"
                placeholder="Capacity"
                value={vehicleForm.capacity}
                onChange={(e) => setVehicleForm({ ...vehicleForm, capacity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type='text'
                placeholder='Vehicle Color'
                value={vehicleForm.vehicleColor}
                onChange={(e) => setVehicleForm({ ...vehicleForm, vehicleColor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleAddVehicle}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Vehicle
              </button>
              <button
                onClick={() => setShowAddVehicle(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
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