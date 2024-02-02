const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const editorSchema = new Schema({
    title: {type: String, required: true},
    creator: {type: String, required: true},
    editorValue: {type: String, required: true}
});

module.exports = mongoose.model('Editor', editorSchema);