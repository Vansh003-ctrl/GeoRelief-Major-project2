const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    status: {
    type: String,
    enum: ['Available', 'In Transit', 'Allocated'],
    default: 'Available',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Resource', ResourceSchema);
