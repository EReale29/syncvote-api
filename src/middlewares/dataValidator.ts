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
  body('category')
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
