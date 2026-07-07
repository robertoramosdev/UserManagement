import User from "../models/User.js";

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// @route GET /api/users  (admin only)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users: users.map(sanitize) });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/users/:id  (admin or owner)
export const getUser = async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      res.status(403);
      throw new Error("Forbidden");
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json({ user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/users/:id  (admin or owner)
export const updateUser = async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && req.user.id !== req.params.id) {
      res.status(403);
      throw new Error("Forbidden");
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // re-hashed by pre-save hook
    // Only admins may change roles
    if (req.body.role && req.user.role === "admin") user.role = req.body.role;

    await user.save();
    res.json({ user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/users/:id  (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    await user.deleteOne();
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};
