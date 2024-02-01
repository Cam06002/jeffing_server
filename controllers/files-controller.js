const {v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');


let DUMMY_FILE = [
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
    const userFiles = DUMMY_FILE.filter( u => {
        return u.creator === userId;
    });

    if(!userFiles || userFiles.length === 0){
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
    const {title, editorValue} = req.body;
    const editorId = req.params.eid;
    const fileToEdit = {...DUMMY_FILE.find( e => e.id === editorId)};
    const fileIndex = DUMMY_FILE.findIndex( e => e.id === editorId);
    fileToEdit.title = title;
    fileToEdit.editorValue = editorValue;

    DUMMY_FILE[fileIndex] = fileToEdit;

    res.status(200).json({place: fileToEdit});
}

const deleteEditorFile = (req, res, next) => {
    const editorId = req.params.eid;
    DUMMY_FILE = DUMMY_FILE.filter(e => e.id !== editorId);
    res.status(200).json({message: 'Deleted Editor File'});
}

exports.getFileByEdtiorId = getFileByEdtiorId;
exports.getFilesByUserId = getFilesByUserId;
exports.postNewFile = postNewFile;
exports.patchEditorFile = patchEditorFile;
exports.deleteEditorFile = deleteEditorFile;