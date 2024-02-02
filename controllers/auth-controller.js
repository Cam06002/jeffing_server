const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/usersModel');

const login = (req, res, next) => {
    const {email, password} = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password){
        return next(new HttpError('Email or password incorrect. Please try again.', 401));
    }
   
    res.json({message: 'Logged in!'});
}

const register = async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()){
        return next(new HttpError('Invalid name, email or password. Please try again.', 422));
    }

    const {name, email, password, editors} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    } catch (err) {
        return next(new HttpError('Signing up failed. Please try again.', 500));
    }

    if (existingUser) {
        return next(new HttpError('User already exists. Please log in.', 422));
    }

    const createdUser = new User({
        name,
        email,
        password,
        editors
    });

    try {
        await createdUser.save();
    } catch (err) {
        return next(new HttpError('Signing up failed. Please try again.', 500));
    }

    res.status(201).json({user: createdUser.toObject({getters: true})});
}

exports.login = login;
exports.register = register;
