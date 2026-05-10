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
      error: "Internal Server Error",
    });
  }
};
const findGenerationByid = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await generationService.findGenerationByid(id);

    return res.status(200).json({
      success: true,
      message: "Generation retrieved successfully",
      data: result,
    });
  } catch (err) {
    if (err.message === "Generation not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    }

    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
const updateGeneration = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const result = await generationService.updateGeneration(id, body);

    return res.status(200).json({
      success: true,
      message: "Generation updated successfully",
      data: result,
    });
  } catch (err) {
    if (err.message === "Generation not found") {
      return res.status(404).json({
        success: false,
        message: err.message,
      });
    } else {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};
const deleteGeneration = async (req, res) => {
  try {
    const { id } = req.params;
    await generationService.deleteGeneration(id);
    return res.status(200).json({
      success: true,
      message: "Generation deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  createGeneration,
  findGenerationByid,
  updateGeneration,
  deleteGeneration,
};
