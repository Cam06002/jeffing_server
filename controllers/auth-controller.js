const {v4: uuidv4 } = require('uuid');
const {validationResult} = require('express-validator');
const MongoClient = require('mongodb').MongoClient;

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Bob Wehadababyitsaboy',
        email: 'bob@bob.com',
        password: 'test1234'
    }
]

const login = (req, res, next) => {
    const {email, password} = req.body;

    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if (!identifiedUser || identifiedUser.password !== password){
        return next(new HttpError('Email or password incorrect. Please try again.', 401));
    }
   
    res.json({message: 'Logged in!'});
}

const register = (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()){
        return next(new HttpError('Invalid name, email or password. Please try again.', 422));
    }

    const {name, email, password} = req.body;

    const userExists = DUMMY_USERS.find(u => u.email === email);
    if (userExists) {
        return next (new HttpError('User email alread exists. Could not create user.', 422));
    }

    const createdUser = {
        id: uuidv4(),
        name,
        email,
        password
    }

    DUMMY_USERS.push(createdUser);
   
    res.status(201).json({user: createdUser});
}

exports.login = login;
exports.register = register;
