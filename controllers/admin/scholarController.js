const scholarService = require('../../services/admin/scholarService');
const {sendResponse} = require('../../utils/responseHelper');

const createScholarshipType = async (req, res) => {
    try {
        let arrs = req.body;
        let result = await scholarService.createScholarshipType(arrs);
        return sendResponse(res, 201, true, 'Scholarship type created successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const getScholarshipTypes = async (req, res) => {
    try {
        let result = await scholarService.getScholarships();
        return sendResponse(res, 200, true, 'Scholarship types retrieved successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const updateScholarshipType = async (req, res) => {
    try {
        let id = req.params.id;
        let body = req.body;
        let [result] = await scholarService.updateScholarshipType(id,body);
        return sendResponse(res, 200, true, 'Scholarship type updated successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const deleteScholarshipType = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await scholarService.deleteScholarshipType(id);
        return sendResponse(res, 200, true, 'Delete Scholarship successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const createScholarshipSubject = async (req, res) => {
    try {
        let arrs = req.body;
        let result = await scholarService.createScholarshipSubject(arrs);
        return sendResponse(res, 201, true, 'Scholarship subject created successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const getAllScholarshipSubjects = async (req, res) =>  {
    try {
        let result = await scholarService.getAllScholarshipSubjects();
        return sendResponse(res, 200, true, 'Scholarship subjects retrieved successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    createScholarshipType,
    getScholarshipTypes,
    updateScholarshipType,
    deleteScholarshipType,
    createScholarshipSubject,
    getAllScholarshipSubjects
}