import User from "../models/User.js";

const sanitize = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

// Escape user input before using it in a regex
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @route GET /api/users?page=1&limit=10&search=  (admin only)
export const getUsers = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const search = (req.query.search || "").trim();

    const filter = search
      ? {
          $or: [
            { name: { $regex: escapeRegex(search), $options: "i" } },
            { email: { $regex: escapeRegex(search), $options: "i" } },
          ],
        }
      : {};

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      users: users.map(sanitize),
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
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
    // Only admins may change roles, and never their own (avoids self-lockout)
    if (
      req.body.role &&
      req.user.role === "admin" &&
      req.user.id !== req.params.id
    ) {
      user.role = req.body.role;
    }

    await user.save();
    res.json({ user: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/users/:id  (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    if (req.user.id === req.params.id) {
      res.status(400);
      throw new Error("You cannot delete your own account");
    }
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
