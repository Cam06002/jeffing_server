const {validationResult} = require('express-validator');

const HttpError = require('../models/http-error');
const Editor = require('../models/editorModel');

const getFileByEdtiorId = async (req, res, next) => {
    const editorId = req.params.eid;

    let journal;
    try {
        journal = await Editor.findById(editorId);
    } catch (err) {
        return next( new HttpError('Unable to find editor file', 500));
    }

    if(!journal){
       return next(new HttpError('Could not find journal by editor ID.', 404));
    }

    res.json({journal: journal.toObject({getters: true})});
}

const getFilesByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userFiles;
    try {
        userFiles = await Editor.find({creator: userId});
    } catch (err) {
        return next( new HttpError('Something went wrong. Unable to find editor files for user', 500));
    }

    if(!userFiles || userFiles.length === 0){
        return next(new HttpError('Could not find journals for user.', 404));
    }   

    res.json({userFiles: userFiles.map(file => file.toObject({getters: true}))});
}

const postNewFile =  async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()){
        return next(new HttpError('Empty title or body. Could not save.', 422));
    }

    const {title, creator, editorValue} = req.body;
    const createdFile = new Editor({
        title,
        creator,
        editorValue
    });

    try {
        await createdFile.save();
    } catch (err) {
        return next( new HttpError('Unable to save file', 500));
    }

    res.status(201).json({file: createdFile});
}

const patchEditorFile = async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()){
        return next(new HttpError('Empty title or body. Could not save.', 422));
    }

    const {title, editorValue} = req.body;
    const editorId = req.params.eid;

    let editor;

    try {
        editor = await Editor.findById(editorId);
    } catch (err) {
        return next( new HttpError('Unable to update file.', 500));
    }

    editor.title = title;
    editor.editorValue = editorValue;

    try {
        await editor.save();
    } catch (err) {
        return next( new HttpError('Something went wrong. Unable to update file.', 500));
    }

    res.status(200).json({editor: editor.toObject({getters: true})});
}

const deleteEditorFile = async (req, res, next) => {
    const editorId = req.params.eid;
    
    let editor;
    try {
        editor = await Editor.findById(editorId);
    } catch (err) {
        return next( new HttpError('Something went wrong. Unable to find file for deletion.', 500));
    }

    try {
        await editor.deleteOne();
    } catch (err) {
        return next( new HttpError('Something went wrong. Unable to delete file.', 500));
    }

    res.status(200).json({message: 'Deleted Editor File'});
}

exports.getFileByEdtiorId = getFileByEdtiorId;
exports.getFilesByUserId = getFilesByUserId;
exports.postNewFile = postNewFile;
exports.patchEditorFile = patchEditorFile;
exports.deleteEditorFile = deleteEditorFile;