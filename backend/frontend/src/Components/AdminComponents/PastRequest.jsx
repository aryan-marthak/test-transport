import React from 'react';
import { History, User, Users, Car, MapPin, Calendar } from 'lucide-react';

const PastRequest = ({ pastRequests, getStatusColor, formatDateLong, handleCompleteTrip }) => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Past Handled Requests</h2>
    {pastRequests.length === 0 ? (
      <div className="text-center py-12">
        <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No past requests found</p>
      </div>
    ) : (
      [...pastRequests]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .map(request => (
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
                <div className='flex gap-4'>
                  {request.status === "Approved" && (
                    <button onClick={() => handleCompleteTrip(request._id)}
                      className='bg-green-600 text-white px-5 py-1 rounded-full hover:bg-green-700 transition'>
                      Complete this Trip
                    </button>
                  )}
                  <span className={`inline-flex items-center px-5 py-3 rounded-full text-md font-semibold border border-gray-400 ${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                </div>
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

export default PastRequest;
