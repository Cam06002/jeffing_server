const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const editorSchema = new Schema({
    title: {type: String, required: true},
    creator: {type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    editorValue: {type: Array, required: true}
});

module.exports = mongoose.model('Editor', editorSchema);