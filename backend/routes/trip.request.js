import express from "express";
import tripRequest from "../models/trip.request.model.js"
import secureRoute from "../middleware/secureRoute.js";
import driverModel from "../models/driver.model.js";
import vehicleModel from "../models/vehicle.model.js";

const router = express.Router();

// POST REQUEST FOR CREATING NEW TRIP

router.post('/', secureRoute, async (req, res) => {
    try {
        const { purpose, designation, vehicleClass, destination, pickupPoint, startDate, startTime, endDate, numberOfPassengers, remarks } = req.body;

        const newTripRequest = new tripRequest({
            purpose,
            designation,
            vehicleClass,
            destination,
            pickupPoint,
            startDate: new Date(startDate),
            startTime,
            endDate: new Date(endDate),
            numberOfPassengers: parseInt(numberOfPassengers),
            remarks: remarks || '',
            createdBy: req.user._id
        });

        const savedTripRequest = await newTripRequest.save();
        res.status(201).json(savedTripRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error creating trip request', error: error.message });
    }
});

// GET REQUEST FOR GETTING ALL THE TRIPS

router.get('/', secureRoute, async (req, res) => {
    try {
        let trips;
        if (req.user.role === 'admin') {
            trips = await tripRequest.find({}).populate('createdBy');
        } else {
            trips = await tripRequest.find({ createdBy: req.user._id }).populate('createdBy');
        }
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error: error.message });
    }
});

// APPROVE AND ASSIGN VEHICLE/DRIVER TO TRIP REQUEST
router.post('/:id/approve', secureRoute, async (req, res) => {
  try {
    const { vehicleId, driverId, remarks } = req.body;
    const tripRequestId = req.params.id;

    // Find driver and vehicle
    const driver = await driverModel.findById(driverId);
    const vehicle = await vehicleModel.findById(vehicleId);

    if (!driver || !vehicle) {
      return res.status(404).json({ message: 'Driver or Vehicle not found' });
    }

    // Correctly update vehicle and driver status
    await vehicleModel.findByIdAndUpdate(vehicleId, { status: 'assigned' });
    await driverModel.findByIdAndUpdate(driverId, { status: 'assigned' });

    // Update trip request
    const updatedTrip = await tripRequest.findByIdAndUpdate(
      tripRequestId,
      {
        status: 'Approved',
        remarks: remarks || '',
        vehicleDetails: {
          driverName: driver.driverName,
          phoneNo: driver.phoneNo,
          vehicleNo: vehicle.vehicleNo,
          vehicleName: vehicle.vehicleName,
          vehicleColor: vehicle.vehicleColor
        }
      },
      { new: true }
    );

    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: 'Error approving trip request', error: error.message });
  }
});

// REJECT TRIP REQUEST
router.post('/:id/reject', secureRoute, async (req, res) => {
  try {
    const { remarks } = req.body;
    const tripRequestId = req.params.id;

    // Update trip request status to Rejected and save remarks
    const updatedTrip = await tripRequest.findByIdAndUpdate(
      tripRequestId,
      {
        status: 'Rejected',
        remarks: remarks || ''
      },
      { new: true }
    );

    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting trip request', error: error.message });
  }
});

export default router;

