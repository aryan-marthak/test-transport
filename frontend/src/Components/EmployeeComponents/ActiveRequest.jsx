import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';

const ActiveRequest = ({
  activeRequests,
  onViewDetails,
  getStatusColor,
  getStatusIcon,
  formatDate
}) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-2 mb-4">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <h3 className="text-lg font-semibold text-gray-800">Active Requests</h3>
      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
        {activeRequests.length}
      </span>
    </div>
    {activeRequests.map((request) => (
      <div
        key={request._id}
        className="bg-white rounded-lg shadow-md border-l-4 border-l-blue-500 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
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
              onClick={() => onViewDetails(request)}
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
);

export default ActiveRequest;
