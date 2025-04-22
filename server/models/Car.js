const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear(),
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    mileage: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for license plate search
carSchema.index({ licensePlate: 1 });

module.exports = mongoose.model('Car', carSchema); 