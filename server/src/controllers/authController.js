import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// Shared registration logic for both roles
const register = async (req, res, next, role) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email and password are required");
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(400);
      throw new Error("That email is already in use");
    }

    const user = await User.create({ name, email, password, role });
    const token = generateToken(user);

    res.status(201).json({ user: sanitize(user), token });
  } catch (err) {
    next(err);
  }
};

// Shared login logic; if requiredRole is set, enforce it
const login = async (req, res, next, requiredRole) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (requiredRole && user.role !== requiredRole) {
      res.status(403);
      throw new Error("You are not allowed to log in here");
    }

    const token = generateToken(user);
    res.json({ user: sanitize(user), token });
  } catch (err) {
    next(err);
  }
};

// @route POST /api/auth/signup
export const signupUser = (req, res, next) => register(req, res, next, "user");

// @route POST /api/auth/login
export const loginUser = (req, res, next) => login(req, res, next, "user");

// @route POST /api/auth/admin/signup
export const signupAdmin = (req, res, next) => register(req, res, next, "admin");

// @route POST /api/auth/admin/login
export const loginAdmin = (req, res, next) => login(req, res, next, "admin");

// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ user: sanitize(req.user) });
};
