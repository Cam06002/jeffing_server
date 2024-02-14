const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Editor = require('../models/editorModel');
const User = require('../models/usersModel');

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

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        return next( new HttpError('Unable to save file. Please try again.', 500));
    }

    if (!user) {
        return next( new HttpError('Could not find user for provided ID.', 404));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdFile.save({session: sess});
        user.editors.push(createdFile);
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        return next( new HttpError('Unable to save file. Session error.', 500));
    }

    res.status(201).json({editor: createdFile.toObject({getters: true})});
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

    if (editor.creator.toString() !== req.userData.userId) {
        return next(new HttpError('You are not allowed to edit this file', 401));
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
        editor = await Editor.findById(editorId).populate('creator');
    } catch (err) {
        return next( new HttpError('Something went wrong. Unable to find file for deletion.', 500));
    }

    if (!editor) {
        return next (new HttpError('Unalbe to find editor with this ID.', 404));
    }

    if (editor.creator.id !== req.userData.userId) {
        return next(new HttpError('You are not allowed to deleten this file', 401));
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await editor.deleteOne({session: sess});
        editor.creator.editors.pull(editor);
        await editor.creator.save({session: sess});
        await sess.commitTransaction();
        
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