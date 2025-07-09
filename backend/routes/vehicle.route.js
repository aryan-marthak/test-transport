import express from 'express';
import Vehicle from '../models/vehicle.model.js';

const router = express.Router();

// GET all vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find({});
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
});

// POST create new vehicle
router.post('/', async (req, res) => {
  try {
    const { vehicleName, capacity, vehicleNo, vehicleClass, vehicleColor } = req.body;
    
    const newVehicle = new Vehicle({
      vehicleName,
      capacity: parseInt(capacity),
      vehicleNo,
      vehicleColor,
      vehicleClass
    });

    const savedVehicle = await newVehicle.save();
    res.status(201).json(savedVehicle);
  } catch (error) {
    res.status(500).json({ message: 'Error creating vehicle', error: error.message });
  }
});

// DELETE vehicle by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);
    
    if (!deletedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
  }
});

// POST update vehicle out of service status
router.post('/:id/toggleStatus', async (req, res) => {
  try {
    const { id } = req.params;
    const { outOfService } = req.body;
    
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      id,
      { outOfService },
      { new: true }
    );
    
    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.status(200).json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: 'Error updating vehicle out of service status', error: error.message });
  }
});

export default router;
