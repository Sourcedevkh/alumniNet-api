const gradeService = require('../../services/admin/gradeService');
const { sendResponse } = require('../../utils/responseHelper');

const createGrade = async (req, res) => {
    try {
        let result = await gradeService.createGrade(req.body);
        sendResponse(res, 201, true, 'Grade created successfully', result);
    }catch (error) {
        sendResponse(res, 400, false, error.message);
    }
}


const getAllGrades = async (req, res) => {
    try {
        let result = await gradeService.getAllGrades();
        sendResponse(res, 200, true, 'Grades retrieved successfully', result);    
    }catch (error) {
        sendResponse(res, 400, false, error.message);
    }
}

const updateGrade = async (req, res) => {
    try {
        let id = req.params.id;
        let body = req.body;
        let result = await gradeService.updateGrade(id, body);
        sendResponse(res, 200, true, 'Grade updated successfully', result);    
    }catch (error) {
        sendResponse(res, 400, false, error.message);
    }
}

const deleteGrade = async (req, res) => {
    try {
        let id = req.params.id;
        let body = req.body;
        let result = await gradeService.deleteGrade(id);
        sendResponse(res, 200, true, 'Grade deleted successfully', result);
    }catch (error) {
        sendResponse(res, 400, false, error.message);
    }
}


const getGradeById = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await gradeService.getGradeById(id);
        sendResponse(res, 200, true, 'Grade retrieved successfully', result);
    }catch (error) {
        sendResponse(res, 400, false, error.message);
    }
}
module.exports = {
    createGrade,
    getAllGrades,
    updateGrade,
    deleteGrade,
    getGradeById
};