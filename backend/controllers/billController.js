const Bill = require('../models/Bill');

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private (Owners see all, Cashiers see theirs)
const getBills = async (req, res) => {
  try {
    const query = req.user.role === 'owner' ? {} : { cashierId: req.user._id };
    const bills = await Bill.find(query).sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new bill
// @route   POST /api/bills
// @access  Private
const createBill = async (req, res) => {
  console.log('--- 🛡️ INCOMING BILL REQUEST ---');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('User:', req.user ? req.user.username : 'NO USER');

  try {
    const { items, paymentMethod, status } = req.body;

    // 🛡️ SECURITY AUDIT & VALIDATION
    if (!items || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    const computedTotal = items.reduce((sum, item) => {
      if (!item || typeof item.price !== 'number' || item.price < 0 || !Number.isFinite(item.price) || !item.quantity || item.quantity <= 0) {
        throw new Error('Invalid item structure');
      }
      return sum + (item.price * item.quantity);
    }, 0);

    if (computedTotal <= 0) return res.status(400).json({ message: 'Invalid total amount' });

    // Generate Formatted Bill Number: M&G's-0007-OP9C-22032026
    const count = await Bill.countDocuments();
    const sequence = String(count + 1).padStart(4, '0');
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Robust Date Formatting (avoid locale issues)
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    const dateStr = `${d}${m}${y}`;
    
    const generatedBillNumber = `M&G's-${sequence}-${randomCode}-${dateStr}`;

    const bill = await Bill.create({
      billNumber: generatedBillNumber,
      items,
      total: Number(computedTotal.toFixed(2)),
      paymentMethod,
      status,
      cashier: req.user.username,
      cashierId: req.user._id
    });

    console.log('✅ Bill Created Successfully:', bill.billNumber);
    res.status(201).json(bill);
  } catch (error) {
    console.error('❌ Bill Creation Failed!');
    console.error('Error Stack:', error.stack);
    
    // Return specific validation error if possible
    const message = error.name === 'ValidationError' 
      ? Object.values(error.errors).map(e => e.message).join(', ')
      : error.message;
      
    res.status(400).json({ 
      message: '!!! Order Creation DEBUG !!!: ' + message,
      receivedBody: req.body 
    });
  }
};

// @desc    Update bill status
// @route   PATCH /api/bills/:id
// @access  Private
const updateBillStatus = async (req, res) => {
  try {
    const { status, paymentMethod } = req.body;
    const bill = await Bill.findByIdAndUpdate(
      req.params.id, 
      { status, paymentMethod }, 
      { returnDocument: 'after' }
    );
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json(bill);
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
};

// @desc    Get single bill containing M-Pesa status
// @route   GET /api/bills/:id
// @access  Private
const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a bill
// @route   DELETE /api/bills/:id
// @access  Private/Owner
const deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    
    await Bill.deleteOne({ _id: req.params.id });
    res.json({ message: 'Bill removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getBills, createBill, updateBillStatus, getBillById, deleteBill };
