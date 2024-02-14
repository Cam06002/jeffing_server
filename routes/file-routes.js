const express = require('express');
const {check} = require('express-validator');

const fileController = require('../controllers/files-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.use(checkAuth);

router.get('/:eid', fileController.getFileByEdtiorId);
router.get('/user/:uid', fileController.getFilesByUserId);

router.post('/',[ check('title').not().isEmpty(), check('editorValue').not().isEmpty()],fileController.postNewFile);

router.patch('/:eid', [ check('title').not().isEmpty(), check('editorValue').not().isEmpty()], fileController.patchEditorFile);

router.delete('/:eid', fileController.deleteEditorFile);

module.exports = router;