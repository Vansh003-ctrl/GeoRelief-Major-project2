const express = require('express');
const router = express.Router();
const incidentController = require('../controllers/incidentController');

// ✅ Naya incident report karne ka route
router.post('/', incidentController.reportIncident);

router.get('/', incidentController.getIncidents);

module.exports = router;