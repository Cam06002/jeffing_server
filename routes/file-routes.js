const express = require('express');

const fileController = require('../controllers/files-controller');

const router = express.Router();

router.get('/:eid', fileController.getFileByEdtiorId);
router.get('/user/:uid', fileController.getFilesByUserId);
router.post('/', fileController.postNewFile);

module.exports = router;