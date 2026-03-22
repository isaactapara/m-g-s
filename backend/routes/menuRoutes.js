const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect, ownerOnly } = require('../middleware/auth');

router.route('/')
  .get(protect, getMenu)
  .post(protect, ownerOnly, addMenuItem);

router.route('/:id')
  .patch(protect, ownerOnly, updateMenuItem)
  .delete(protect, ownerOnly, deleteMenuItem);

module.exports = router;
