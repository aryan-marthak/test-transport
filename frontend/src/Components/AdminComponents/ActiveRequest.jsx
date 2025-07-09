import React from 'react';
import { FileText, User, Users, Car, MapPin, Calendar, Check, X } from 'lucide-react';

const ActiveRequest = ({ activeRequests, getStatusColor, setSelectedRequest, handleReject }) => (
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
                      {request.startDate} at {request.startTime}
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
                      {request.endDate}
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

export default ActiveRequest;
