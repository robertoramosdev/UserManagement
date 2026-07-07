import { body } from "express-validator";

// Keep email handling consistent with the User model (trim + lowercase)
// without the surprising provider-specific rewrites of normalizeEmail().
const emailField = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .bail()
  .isEmail()
  .withMessage("A valid email is required")
  .bail()
  .customSanitizer((v) => v.toLowerCase());

export const signupRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 60 })
    .withMessage("Name must be at most 60 characters"),
  emailField,
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .isLength({ max: 128 })
    .withMessage("Password is too long"),
];

export const loginRules = [
  emailField,
  body("password").notEmpty().withMessage("Password is required"),
];
