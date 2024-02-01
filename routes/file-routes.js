const express = require('express');

const fileController = require('../controllers/files-controller');

const router = express.Router();

router.get('/', fileController.getFileByEdtiorId);
router.get('/', fileController.getFilesByUserId);

module.exports = router;