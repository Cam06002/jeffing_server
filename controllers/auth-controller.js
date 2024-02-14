const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error');
const User = require('../models/usersModel');

const login = async (req, res, next) => {
    const {email, password} = req.body;

    let existingUser;

    try{
        existingUser = await User.findOne({email: email});
    } catch (err) {
        return next(new HttpError('Logging in failed. Please try again.', 500));
    }

    if (!existingUser){
        return next(new HttpError('Could not find a user for provided email. Please register.', 401));
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        return next(new HttpError('Logging in failed. Please try again.', 500));
    }

    if (!isValidPassword) {
        return next(new HttpError('Incorrect password. Please try again.', 500));
    }

    let token;
    try {
        token = jwt.sign(
            { user: existingUser.id, 
            email: existingUser.email }, 
            'jeffingsecret3keyforstuff', 
            {expiresIn: '8h'}
        );
    } catch (err) {
        return next(new HttpError('Logging in failed. Please try again.', 500));
    }
   
    res.json({userId: existingUser.id, email: existingUser.email, token: token });
}

const register = async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()){
        return next(new HttpError('Invalid name, email or password. Please try again.', 422));
    }

    const {name, email, password} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    } catch (err) {
        return next(new HttpError('Signing up failed. Please try again.', 500));
    }

    if (existingUser) {
        return next(new HttpError('User already exists. Please log in.', 422));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        return next(new HttpError('Signing up failed. Please try again.', 500));
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        editors: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        return next(new HttpError('Signing up failed. Please try again.', 500));
    }

    let token;
    try {
        token = jwt.sign(
            { user: createdUser.id, 
            email: createdUser.email }, 
            'jeffingsecret3keyforstuff', 
            {expiresIn: '8h'}
        );
    } catch (err) {
        return next(new HttpError('Signing up failed. Please try again.', 500));
    }

    res.status(201).json({userId: createdUser.id, email: createdUser.email, token: token });
}

exports.login = login;
exports.register = register;
