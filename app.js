const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');
const fileRoutes = require('./routes/file-routes');
const authRoutes = require('./routes/auth-routes');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/files', fileRoutes);
app.use('/api/auth', authRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Cannot find this route');
    throw error;
});

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
    .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_NAME}.p6uc4vv.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        app.listen(5000);
    })
    .catch( err => {
        console.log(err);
    });

