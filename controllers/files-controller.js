const {v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');


const DUMMY_FILE = [
    {
        id: 'e1',
        title: 'Test Journal',
        creator: 'u1',
        editorValue: 'This is my first journal entry.'
    }
];

const getFileByEdtiorId = (req, res, next) => {
    const editorId = req.params.eid;
    const journal = DUMMY_FILE.find(e => {
        return e.id === editorId;
    });

    if(!journal){
       return next(new HttpError('Could not find journal by editor ID.', 404));
    }

    res.json({journal});
}

const getFilesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const userFiles = DUMMY_FILE.find( u => {
        return u.creator === userId;
    });

    if(!userFiles){
        return next(new HttpError('Could not find journals for user.', 404));
    }   

    res.json({userFiles});
}

const postNewFile = (req, res, next) => {
    const {title, creator, editorValue} = req.body;
    const createdFile = {
        id: uuidv4(),
        title,
        creator,
        editorValue
    }

    DUMMY_FILE.unshift(createdFile);

    res.status(201).json({file: createdFile});
}

const patchEditorFile = (req, res, next) => {
    const editorId = req.params.eid;
    const fileToEdit = DUMMY_FILE.find( e => {
        return e.id === editorId;
    });
    
}

const deleteEditorFile = (req, res, next) => {
    const editorId = req.params.eid;
    const fileToEdit = DUMMY_FILE.find( e => {
        return e.id === editorId;
    });
    DUMMY_FILE.pop(fileToEdit);
}

exports.getFileByEdtiorId = getFileByEdtiorId;
exports.getFilesByUserId = getFilesByUserId;
exports.postNewFile = postNewFile;
exports.patchEditorFile = patchEditorFile;
exports.deleteEditorFile = deleteEditorFile;