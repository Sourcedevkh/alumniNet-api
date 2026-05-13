const express = require("express");
const router = express.Router();

const generationController = require("../../controllers/admin/generationController");

const { isLogin } = require("../../middlewares/auth");
const validate = require('../../middlewares/validate');
const { generationSchema } = require("../../validators/generation");

router.get('/', isLogin, generationController.getAllGenerations);
router.post("/",isLogin,  validate(generationSchema),generationController.createGeneration,);
router.get("/:id", isLogin,generationController.findGenerationByid);
router.put("/:id", isLogin, validate(generationSchema),generationController.updateGeneration);
router.delete("/:id", isLogin, generationController.deleteGeneration);

module.exports = router;
