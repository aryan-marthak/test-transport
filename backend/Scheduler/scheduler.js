import cron from 'node-cron';
import tripRequest from '../models/trip.request.model.js';
import driverModel from '../models/driver.model.js';
import vehicleModel from '../models/vehicle.model.js';

// Run this job every minute
cron.schedule('* * * * *', async () => {
    const now = new Date();
    try {
        // Find all approved trips whose endDate has passed
        const tripsToComplete = await tripRequest.find({
            status: 'Approved',
            endDate: { $lte: now }
        });

        for (const trip of tripsToComplete) {
            // Mark trip as completed
            trip.status = 'Completed';
            await trip.save();

            // Set driver and vehicle back to available using IDs directly
            if (trip.vehicleDetails?.driverId) {
                await driverModel.findByIdAndUpdate(trip.vehicleDetails.driverId, { status: 'available' });
            }
            if (trip.vehicleDetails?.vehicleId) {
                await vehicleModel.findByIdAndUpdate(trip.vehicleDetails.vehicleId, { status: 'available' });
            }
        }
        if (tripsToComplete.length > 0) {
            console.log(`Completed ${tripsToComplete.length} trips at ${now.toISOString()}`);
        }
    } catch (error) {
        console.error('Error in scheduled trip completion:', error);
    }
});

