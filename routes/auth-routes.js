const express = require('express');
const {check} = require('express-validator');

const authController = require('../controllers/auth-controller');

const router = express.Router();

router.post('/login', authController.login);
router.post('/register',
    [ 
        check('name').not().isEmpty(),
        check('email').normalizeEmail().isEmail(),
        check('password').isLength({min: 8})
    ], 
    authController.register);

module.exports = router;