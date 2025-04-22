const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Get all cars
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().sort({ make: 1, model: 1 });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one car
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    res.json(car);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create car
router.post('/', async (req, res) => {
  try {
    // Check for duplicate license plate
    const existingCar = await Car.findOne({
      licensePlate: req.body.licensePlate.toUpperCase(),
    });
    if (existingCar) {
      return res
        .status(400)
        .json({ message: 'A car with this license plate already exists' });
    }

    const car = new Car({
      make: req.body.make,
      model: req.body.model,
      year: req.body.year,
      licensePlate: req.body.licensePlate.toUpperCase(),
      mileage: req.body.mileage,
    });

    const newCar = await car.save();
    res.status(201).json(newCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update car
router.patch('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }

    // Check for duplicate license plate if it's being updated
    if (
      req.body.licensePlate &&
      req.body.licensePlate.toUpperCase() !== car.licensePlate
    ) {
      const existingCar = await Car.findOne({
        licensePlate: req.body.licensePlate.toUpperCase(),
      });
      if (existingCar) {
        return res
          .status(400)
          .json({ message: 'A car with this license plate already exists' });
      }
    }

    // Update fields
    if (req.body.make) car.make = req.body.make;
    if (req.body.model) car.model = req.body.model;
    if (req.body.year) car.year = req.body.year;
    if (req.body.licensePlate)
      car.licensePlate = req.body.licensePlate.toUpperCase();
    if (req.body.mileage) car.mileage = req.body.mileage;

    const updatedCar = await car.save();
    res.json(updatedCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete car
router.delete('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ message: 'Car not found' });
    }
    await car.remove();
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 