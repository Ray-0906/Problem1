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
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
