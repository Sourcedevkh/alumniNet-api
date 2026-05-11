const express = require("express");
const router = express.Router();

const validate = require("../../validators/generation");

const generationController = require("../../controllers/admin/generationController");

router.get('/', generationController.getAllGenerations);
router.post("/",validate.validateCreateGeneration,generationController.createGeneration,);
router.get("/:id",generationController.findGenerationByid);
router.put("/:id",validate.validateUpdateGeneration,generationController.updateGeneration);
router.delete("/:id", generationController.deleteGeneration);

module.exports = router;
