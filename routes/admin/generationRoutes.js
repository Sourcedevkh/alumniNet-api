const express = require("express");
const router = express.Router();

const validate = require("../../validators/generation");
const {isLogin} = require("../../middlewares/auth");

const generationController = require("../../controllers/admin/generationController");

router.get('/',isLogin, generationController.getAllGenerations);
router.post("/",isLogin,validate.validateCreateGeneration,generationController.createGeneration);
router.get("/:id",isLogin, generationController.findGenerationByid);
router.put("/:id",isLogin,validate.validateUpdateGeneration,generationController.updateGeneration);
router.delete("/:id",isLogin, generationController.deleteGeneration);


module.exports = router;
