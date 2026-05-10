const express = require("express");
const router = express.Router();

const validate = require("../../validators/generation");

const generationController = require("../../controllers/admin/generationController");

router.post("/",validate.validateCreateGeneration,generationController.createGeneration,);
router.get("/:id",generationController.findGenerationByid);

module.exports = router;
