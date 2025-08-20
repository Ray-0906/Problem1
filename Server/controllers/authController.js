import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password, role });
  if (user) {
    res.status(201).json({
       _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp: user.exp || 0,
      plants:user.plantObservations.length || 0,
      achievements: user.achievements.length || 0,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp: user.exp || 0,
      plants:user.plantObservations.length || 0,
      achievements: user.achievements.length || 0,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp: user.exp || 0,
      plants: Array.isArray(user.plantObservations) ? user.plantObservations.length : 0,
      achievements: Array.isArray(user.achievements) ? user.achievements.length : 0,
      location: user.location || null,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, location } = req.body || {};

    if (typeof name === 'string' && name.trim()) user.name = name.trim();

    if (typeof email === 'string' && email.trim() && email.trim() !== user.email) {
      const exists = await User.findOne({ email: email.trim(), _id: { $ne: user._id } });
      if (exists) return res.status(400).json({ message: 'Email already in use' });
      user.email = email.trim();
    }

    if (typeof location === 'string') user.location = location;

    await user.save();

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      exp: user.exp || 0,
      plants: Array.isArray(user.plantObservations) ? user.plantObservations.length : 0,
      achievements: Array.isArray(user.achievements) ? user.achievements.length : 0,
      location: user.location || null,
      message: 'Profile updated',
    });
  } catch (err) {
    console.error('updateUserProfile error', err);
    res.status(500).json({ message: 'Server error' });
  }
};



