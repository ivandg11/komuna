const { body, validationResult } = require('express-validator');

const validateForm = [
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio')
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateForm,
    handleValidationErrors
};