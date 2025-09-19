const User = require('../models/User');

// Sabhi users ko fetch karne ka logic
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Password ko hide karke users fetch karein
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Existing user ka role update karne ka logic
exports.updateUserRole = async (req, res) => {
  const { role } = req.body;
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// User ko delete karne ka logic
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};