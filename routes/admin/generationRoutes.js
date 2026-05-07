const express = require("express");
const router = express.Router();

const validate = require("../../validators/generation");

const generationController = require("../../controllers/admin/generationController");

router.post("/create",validate.validateCreateGeneration,generationController.createGeneration,);

module.exports = router;
