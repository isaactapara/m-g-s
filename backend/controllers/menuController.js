const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Private
const getMenu = async (req, res) => {
  try {
    const menu = await MenuItem.find({ isActive: true });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching menu' });
  }
};

// @desc    Add new menu item
// @route   POST /api/menu
// @access  Private/Owner
const addMenuItem = async (req, res) => {
  const { name, price, category } = req.body;
  try {
    const item = await MenuItem.create({ name, price, category });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: 'Invalid item data' });
  }
};

// @desc    Update menu item
// @route   PATCH /api/menu/:id
// @access  Private/Owner
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
};

// @desc    Delete menu item (Soft delete)
// @route   DELETE /api/menu/:id
// @access  Private/Owner
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

module.exports = { getMenu, addMenuItem, updateMenuItem, deleteMenuItem };
