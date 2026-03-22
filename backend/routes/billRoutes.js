const express = require('express');
const router = express.Router();
const { getBills, createBill, updateBillStatus, getBillById, deleteBill } = require('../controllers/billController');
const { protect, ownerOnly } = require('../middleware/auth');

router.route('/')
  .get(protect, getBills)
  .post(protect, createBill);

router.route('/:id')
  .get(protect, getBillById)
  .patch(protect, updateBillStatus)
  .delete(protect, ownerOnly, deleteBill);

module.exports = router;
