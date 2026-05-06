const authService = require('../../services/admin/authService');
const {sendResponse} = require('../../utils/responseHelper');

const createScholarshipType = async (req, res) => {
    try {
        let arrs = req.body;
        let result = await authService.createScholarshipType(arrs);
        return sendResponse(res, 201, true, 'Scholarship type created successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const getScholarshipTypes = async (req, res) => {
    try {
        let result = await authService.getScholarships();
        return sendResponse(res, 200, true, 'Scholarship types retrieved successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const updateScholarshipType = async (req, res) => {
    try {
        let id = req.params.id;
        let body = req.body;
        let [result] = await authService.updateScholarshipType(id,body);
        return sendResponse(res, 200, true, 'Scholarship type updated successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const deleteScholarshipType = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await authService.deleteScholarshipType(id);
        return sendResponse(res, 200, true, 'Delete Scholarship successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    createScholarshipType,
    getScholarshipTypes,
    updateScholarshipType,
    deleteScholarshipType
}