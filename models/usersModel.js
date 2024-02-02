const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 8},
    editors: {type: String, required: true}
});

usersSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', usersSchema);