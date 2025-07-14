import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';

const PastRequest = ({
  pastRequests,
  onViewDetails,
  getStatusColor,
  getStatusIcon,
  formatDate
}) => (
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
                onClick={() => onViewDetails(request)}
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
);

export default PastRequest;
