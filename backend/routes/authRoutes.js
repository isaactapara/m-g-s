const express = require('express');
const router = express.Router();
const { loginUser, registerUser, getUsers, deleteUser } = require('../controllers/authController');
const { protect, ownerOnly } = require('../middleware/auth');

router.post('/login', loginUser);
router.post('/register', protect, ownerOnly, registerUser);
router.get('/users', protect, ownerOnly, getUsers);
router.delete('/users/:id', protect, ownerOnly, deleteUser);
router.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = router;
