import { validationResult } from "express-validator";

// Runs after a set of express-validator checks; returns 400 with the
// first error message per field if any validation failed.
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();

  const messages = errors.array().map((e) => e.msg);
  res.status(400).json({ message: messages.join(", "), errors: errors.array() });
};
