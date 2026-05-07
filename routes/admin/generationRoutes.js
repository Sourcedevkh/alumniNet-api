const express = require('express');
const router = express.Router();

const generationController = require('../../controllers/admin/generationController');

router.post('/create', generationController.createGeneration);



module.exports = router;