const generationService = require("../../services/admin/generationService");
const { sendResponse } = require("../../utils/responseHelper");

const getAllGenerations = async (req, res) => {
  try{
    const result = await generationService.getAllGeneration();
    sendResponse(res, 200, true, "Get all generations successfully", result);

  }catch(error){
    return sendResponse(res, 500, false, error.message);
  }
};

const createGeneration = async (req, res) => {
  try {
    const body = req.validateBody;
    const result = await generationService.createGeneration(body);
    
    sendResponse(res, 201, true, "Generation created successfully", result);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const findGenerationByid = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await generationService.findGenerationByid(id);

    return sendResponse(res, 200, true, "Generation retrieved successfully", result);
  } catch (error) {
    if (error) {
      return sendResponse(res, 404, false, error.message);
    }
    return sendResponse(res, 500, false, error.message);
  }
};

const updateGeneration = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.validateBody;
    const result = await generationService.updateGeneration(id, body);

    return sendResponse(res, 200, true, "Generation updated successfully", result);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};

const deleteGeneration = async (req, res) => {
  try {
    const { id } = req.params;
    await generationService.deleteGeneration(id);
    return sendResponse(res, 200, true, "Generation deleted successfully", null);
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
};


module.exports = {
  getAllGenerations,
  createGeneration,
  findGenerationByid,
  updateGeneration,
  deleteGeneration,
};
