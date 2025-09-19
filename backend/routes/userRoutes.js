const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth'); // ✅ auth middleware import karein
const admin = require('../middleware/admin'); // ✅ admin middleware import karein

router.get('/', [auth, admin], userController.getUsers);
router.put('/:id', [auth, admin], userController.updateUserRole);
router.delete('/:id', [auth, admin], userController.deleteUser);

module.exports = router;