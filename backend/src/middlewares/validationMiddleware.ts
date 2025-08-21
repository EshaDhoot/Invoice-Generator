import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export const validateRegistration = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required.'),

    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address.')
        .normalizeEmail()
        .custom(async (email) => {
            const userExists = await User.findOne({ email });
            if (userExists) {
                return Promise.reject('E-mail already in use');
            }
        }),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long.'),

    handleValidationErrors
];


export const validateLogin = [
     body('email')
        .isEmail()
        .withMessage('Please provide a valid email address.')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required.'),

    handleValidationErrors
];