import {body, validationResult} from 'express-validator';

function validateProduct(req,res,next)
{
    const errors = validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors: errors.array()});
    }
    next();
}


export const productValidationRules = [
    body('title').notEmpty().withMessage('Product title is required.'),
    body('description').notEmpty().withMessage('Product description is required.'),
    body('priceAmount').isFloat({gt: 0}).withMessage('Product price must be greater than 0.'),
    body('priceCurrency').isIn(['USD', 'EUR', 'GBP', 'INR', 'JPY']).withMessage('Product currency must be one of USD, EUR, GBP, INR, JPY.'),
    body('category').notEmpty().withMessage('Product category is required.'),


    validateProduct

]