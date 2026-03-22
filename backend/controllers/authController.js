const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, pin } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && (await user.comparePIN(pin))) {
      res.json({
        id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid username or PIN' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Private/Owner
const registerUser = async (req, res) => {
  const { username, pin, role } = req.body;
  try {
    const userExists = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (userExists) return res.status(400).json({ message: 'A user with this username already exists' });

    const user = await User.create({ username, pin, role: role || 'cashier' });
    res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (error) {
    console.error('Registration Error:', error.message);
    res.status(400).json({ message: error.message || 'Invalid user data' });
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Owner
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-pin');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Owner
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'owner') return res.status(400).json({ message: 'Cannot delete owner' });
    
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { loginUser, registerUser, getUsers, deleteUser };
