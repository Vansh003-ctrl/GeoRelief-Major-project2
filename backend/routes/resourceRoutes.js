const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const auth = require('../middleware/auth'); // ✅ auth middleware import karein
const admin = require('../middleware/admin'); // ✅ admin middleware import karein

router.post('/', [auth, admin], resourceController.addResource);
router.get('/', auth, resourceController.getResources); // ✅ Normal user bhi resources dekh sakte hain
router.put('/:id', [auth, admin], resourceController.updateResource);
router.delete('/:id', [auth, admin], resourceController.deleteResource);

module.exports = router;