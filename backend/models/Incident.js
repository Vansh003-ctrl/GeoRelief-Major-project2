const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Flood', 'Earthquake', 'Fire', 'Cyclone', 'Other'],
  },
  description: {
    type: String,
    required: true,
  },
  location: { // ✅ Location mein latitude aur longitude hoga
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: true,
  },
  status: {
    type: String,
    enum: ['Reported', 'Verified', 'In Progress', 'Resolved'],
    default: 'Reported',
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Incident', IncidentSchema);