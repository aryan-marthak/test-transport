import React, { useState, useEffect } from 'react';
import {
  Users,
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
  Trash2
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('active-requests');
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);


  const [activeRequests, setActiveRequests] = useState([
    {
      id: 'REQ001',
      employee: 'John Doe',
      companyId: 'EMP001',
      purpose: 'Official',
      destination: 'Client Meeting - Mumbai',
      pickupPoint: 'Office Main Gate',
      startDate: '2024-07-10',
      startTime: '09:00',
      endDate: '2024-07-10',
      endTime: '18:00',
      vehicleClass: 'Business',
      passengers: 2,
      status: 'Pending',
      requestedAt: '2024-07-08 14:30'
    },
    {
      id: 'REQ002',
      employee: 'Jane Smith',
      companyId: 'EMP005',
      purpose: 'Personal',
      destination: 'Airport',
      pickupPoint: 'Residence',
      startDate: '2024-07-11',
      startTime: '06:00',
      endDate: '2024-07-11',
      endTime: '10:00',
      vehicleClass: 'Economy',
      passengers: 1,
      status: 'Pending',
      requestedAt: '2024-07-08 16:45'
    }
  ]);

  const [pastRequests, setPastRequests] = useState([
    {
      id: 'REQ003',
      employee: 'Mike Johnson',
      companyId: 'EMP003',
      purpose: 'Official',
      destination: 'Conference - Delhi',
      status: 'Completed',
      handledAt: '2024-07-05',
      assignedVehicle: 'MH-12-AB-1234',
      assignedDriver: 'Rajesh Kumar'
    }
  ]);

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

  const handleApprove = (requestId, vehicleId, driverId, remarks) => {
    setActiveRequests(prev =>
      prev.map(req =>
        req.id === requestId ? {
          ...req,
          status: 'Approved',
          assignedVehicle: vehicles.find(v => v._id === vehicleId)?.vehicleNo,
          assignedDriver: drivers.find(d => d._id === driverId)?.driverName,
          remarks: remarks
        } : req
      )
    );

    // Update vehicle availability
    setVehicles(prev =>
      prev.map(vehicle =>
        vehicle._id === vehicleId ? { ...vehicle, isAvailable: false } : vehicle
      )
    );

    // Update driver availability
    setDrivers(prev =>
      prev.map(driver =>
        driver._id === driverId ? { ...driver, status: 'assigned' } : driver
      )
    );

    setSelectedRequest(null);
    setAssignmentData({ vehicleId: '', driverId: '', remarks: '' });
  };

  const handleReject = (requestId, reason) => {
    setActiveRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'Rejected', rejectionReason: reason } : req
      )
    );
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
    if (vehicleForm.vehicleNo && vehicleForm.vehicleName && vehicleForm.capacity) {
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

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
  };

  // Fetch drivers and vehicles from server
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
        console.error('Error fetching drivers:', error);
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
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchDrivers();
    fetchVehicles();
  }, []);

  const renderActiveRequests = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Active Vehicle Requests</h2>
      {activeRequests.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No active requests found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {activeRequests.map(request => (
            <div key={request.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{request.employee}</h3>
                  <p className="text-sm text-gray-600">{request.companyId}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {request.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Purpose</p>
                  <p className="font-medium">{request.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium">{request.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-medium">{request.startDate} at {request.startTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vehicle Class</p>
                  <p className="font-medium">{request.vehicleClass}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Pickup Point</p>
                  <p className="font-medium">{request.pickupPoint}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passengers</p>
                  <p className="font-medium">{request.passengers}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Requested At</p>
                  <p className="font-medium">{request.requestedAt}</p>
                </div>
              </div>

              {request.status === 'Pending' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Available Vehicles */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Available {request.vehicleClass} Vehicles</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {getAvailableVehicles(request.vehicleClass).length === 0 ? (
                          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                            No {request.vehicleClass} vehicles available
                          </div>
                        ) : (
                          getAvailableVehicles(request.vehicleClass).map(vehicle => (
                            <div key={vehicle._id} className="flex items-center justify-between bg-green-50 p-3 rounded border">
                              <div>
                                <p className="font-medium text-sm">{vehicle.vehicleNo}</p>
                                <p className="text-xs text-gray-600">{vehicle.vehicleName} • {vehicle.capacity} seats</p>
                              </div>
                              <div className="text-xs text-green-600 font-medium">Available</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Available Drivers */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Available Drivers</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {getAvailableDrivers().length === 0 ? (
                          <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                            No drivers available
                          </div>
                        ) : (
                          getAvailableDrivers().map(driver => (
                            <div key={driver._id} className="flex items-center justify-between bg-blue-50 p-3 rounded border">
                              <div>
                                <p className="font-medium text-sm">{driver.driverName}</p>
                                <p className="text-xs text-gray-600">{driver.phoneNo}</p>
                              </div>
                              <div className="text-xs text-blue-600 font-medium">Available</div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      disabled={getAvailableVehicles(request.vehicleClass).length === 0 || getAvailableDrivers().length === 0}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${getAvailableVehicles(request.vehicleClass).length === 0 || getAvailableDrivers().length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                    >
                      <Check className="h-4 w-4" />
                      <span>Approve & Assign</span>
                    </button>
                    <button
                      onClick={() => handleReject(request.id, 'Rejected by admin')}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
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
        <div className="grid gap-4">
          {pastRequests.map(request => (
            <div key={request.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{request.employee}</h3>
                  <p className="text-sm text-gray-600">{request.companyId}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {request.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Purpose</p>
                  <p className="font-medium">{request.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Destination</p>
                  <p className="font-medium">{request.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned Vehicle</p>
                  <p className="font-medium">{request.assignedVehicle}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned Driver</p>
                  <p className="font-medium">{request.assignedDriver}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
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
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Available
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">Available</p>
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
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${driver.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">{driver.status === 'available' ? 'Available' : 'Assigned'}</p>
              </div>
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
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Employee:</span>
                  <span className="ml-2 font-medium">{selectedRequest.employee}</span>
                </div>
                <div>
                  <span className="text-gray-600">Purpose:</span>
                  <span className="ml-2 font-medium">{selectedRequest.purpose}</span>
                </div>
                <div>
                  <span className="text-gray-600">Destination:</span>
                  <span className="ml-2 font-medium">{selectedRequest.destination}</span>
                </div>
                <div>
                  <span className="text-gray-600">Requested Class:</span>
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
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional notes or instructions..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => handleApprove(
                  selectedRequest.id,
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
    </div>
  );
};

export default AdminDashboard;