const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const Car = require('../models/Car');

// Get all maintenance records for a car
router.get('/car/:carId', async (req, res) => {
  try {
    const records = await Maintenance.find({ carId: req.params.carId }).sort({
      date: -1,
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one maintenance record
router.get('/:id', async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    res.json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create maintenance record
router.post('/', async (req, res) => {
  try {
    // Verify car exists
    const car = await Car.findById(req.body.carId);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    const record = new Maintenance({
      carId: req.body.carId,
      date: req.body.date,
      description: req.body.description,
      mileage: req.body.mileage,
      parts: req.body.parts,
      notes: req.body.notes,
      totalCost: req.body.parts.reduce((total, part) => total + (part.cost * part.quantity), 0)
    });

    const newRecord = await record.save();

    // Update car mileage if maintenance mileage is higher
    if (req.body.mileage > car.mileage) {
      car.mileage = req.body.mileage;
      await car.save();
    }

    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update maintenance record
router.patch('/:id', async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    // Update fields
    if (req.body.date) record.date = req.body.date;
    if (req.body.description) record.description = req.body.description;
    if (req.body.mileage) {
      record.mileage = req.body.mileage;
      
      // Update car mileage if maintenance mileage is higher
      const car = await Car.findById(record.carId);
      if (car && req.body.mileage > car.mileage) {
        car.mileage = req.body.mileage;
        await car.save();
      }
    }
    if (req.body.parts) record.parts = req.body.parts;
    if (req.body.notes) record.notes = req.body.notes;

    const updatedRecord = await record.save();
    res.json(updatedRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete maintenance record
router.delete('/:id', async (req, res) => {
  try {
    const record = await Maintenance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    await record.remove();
    res.json({ message: 'Maintenance record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 