import express from "express";
import tripRequest from "../models/trip.request.model.js"

const router = express.Router();

// POST REQUEST FOR CREATING NEW TRIP

router.post('/', async(req, res) => {
    try {
        const { purpose, designation, vehicleClass, destination, pickupPoint, startDate, startTime, endDate, numberOfPassengers, remarks } = req.body

        const newTripRequest = new tripRequest({
            purpose, designation, vehicleClass, destination, pickupPoint, startDate: new Date(startDate), startTime, endDate: new Date(endDate), numberOfPassengers: parseInt(numberOfPassengers), remarks: remarks || ''
        });

        const savedTripRequest = await newTripRequest.save();
        res.status(201).json(savedTripRequest);
    } catch (error) {
        res.status(500).json({ message: 'Error creating trip request', error: error.message });
    }
})

export default router;