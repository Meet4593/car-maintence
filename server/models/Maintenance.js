const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cost: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const maintenanceSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    mileage: {
      type: Number,
      required: true,
      min: 0,
    },
    parts: [partSchema],
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes for common queries
maintenanceSchema.index({ carId: 1, date: -1 });

// Calculate total cost before saving
maintenanceSchema.pre('save', function (next) {
  this.totalCost = this.parts.reduce(
    (total, part) => total + part.cost * part.quantity,
    0
  );
  next();
});

module.exports = mongoose.model('Maintenance', maintenanceSchema); 