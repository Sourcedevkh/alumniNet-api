const generationService = require("../../services/admin/generationService");

const createGeneration = async (req, res) => {
  try {
    const body = req.body;
    const result = await generationService.createGeneration(body);
    res.status(201).json({
        success: true,
        message: "Generation created successfully",
        data: result,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
        error: "Internal Server Error"
    });
  }
};

module.exports = {
  createGeneration,
};
