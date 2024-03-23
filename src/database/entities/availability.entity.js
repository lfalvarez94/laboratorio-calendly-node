const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedules' },
});

const Availability = mongoose.model('Availabilities', availabilitySchema);

module.exports = Availability;
