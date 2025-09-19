const Incident = require('../models/Incident');

// ✅ Naya incident report karne ka logic
exports.reportIncident = async (req, res) => {
  try {
    const newIncident = new Incident(req.body);
    const incident = await newIncident.save();
    res.json(incident);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ✅ Sabhi incidents ko fetch karne ka logic
exports.getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find().sort({ createdAt: -1 });
    res.json(incidents);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};