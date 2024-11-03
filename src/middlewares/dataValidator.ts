import { body } from "express-validator";

export const validateCreateUser = [
  body('email').isEmail().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('username').notEmpty().withMessage('username is required'),
]

export const validateLoginUser = [
  body('email').isEmail().withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required'),
]

export const validateCreatePost = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string'),
  body('categories')
    .isArray({ min: 1 })
    .withMessage('At least one category is required')
    .custom((categories) =>
      categories.every((category: string) => typeof category === 'string')
    )
    .withMessage('all categories must be string'),
]

export const validateCreateComment = [
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string'),
]

export const validateUpdateUser = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Invalid email format'),
  body('password')
    .optional()
    .notEmpty()
    .withMessage('Password cannot be empty'),
  body('username')
    .optional()
    .notEmpty()
    .withMessage('Username cannot be empty'),
]

export const validateUpdatePost = [
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string'),
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  body('category')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one category is required')
    .custom((categories) =>
      categories.every((category: string) => typeof category === 'string')
    )
    .withMessage('All categories must be strings'),
]

export const validateUpdateComment = [
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
]

export const validateChangePassword = [
  body('oldPassword')
    .notEmpty()
    .withMessage('Password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('Password is required'),
]

export const validateVote = [
  body('vote')
    .notEmpty()
    .withMessage('Vote is required')
    .isIn(['up', 'down'])
    .withMessage('Vote must be either "up" or "down"'),
];
