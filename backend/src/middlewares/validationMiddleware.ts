import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';

const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors: Record<string, string> = {};
        Object.keys(errors.mapped()).forEach(key => {
            formattedErrors[key] = errors.mapped()[key].msg;
        });
        return res.status(400).json({ errors: formattedErrors });
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

export const validateInvoiceCreation = [
    body('clientName')
        .trim()
        .notEmpty()
        .withMessage('Client name is required.'),

    body('clientEmail')
        .isEmail()
        .withMessage('A valid client email is required.')
        .normalizeEmail(),

    body('products')
        .isArray({ min: 1 })
        .withMessage('The invoice must contain at least one product.'),

    body('products.*.name')
        .trim()
        .notEmpty()
        .withMessage('Each product must have a name.'),
    
    body('products.*.quantity')
        .isInt({ gt: 0 }) 
        .withMessage('Product quantity must be a whole number greater than 0.'),

    body('products.*.rate')
        .isFloat({ gt: 0 })
        .withMessage('Product rate must be a number greater than 0.'),


    handleValidationErrors
];