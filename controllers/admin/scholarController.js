const scholarService = require('../../services/admin/scholarService');
const {sendResponse} = require('../../utils/responseHelper');

const createScholarshipType = async (req, res) => {
    try {
        let arrs = req.validateBody;
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
        let body = req.validateBody;
        let [result] = await scholarService.updateScholarshipType(id, body);
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
        let arrs = req.validateBody;
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

const updateScholarshipSubject = async (req, res) => {
    try {
        let id = req.params.id;
        let body = req.validateBody;
        let result = await scholarService.updateScholarshipSubject(id, body);
        return sendResponse(res, 200, true, 'Scholarship subject updated successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const deleteScholarshipSubject = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await scholarService.deleteScholarshipSubject(id);
        return sendResponse(res, 200, true, 'Delete Scholarship successfully', result);
    }catch(error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const createScholarshipTrack = async (req, res) => {
    try {
        let body = req.validateBody;
        let result = await scholarService.createScholarshipTrack(body);
        return sendResponse(res, 200, true, 'Scholarship track created successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const getAllScholarshipTracks = async (req, res) => {
    try {
        let result = await scholarService.getAllScholarshipTracks();
        return sendResponse(res, 200, true, 'Scholarship tracks retrieved successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message)
    }
}

const updateScholarshipTrack = async (req, res) => {
    try {
        let id = req.params.id;
        let body = req.validateBody;
        let result = await scholarService.updateScholarshipTrack(id, body);
        return sendResponse(res, 200, true, 'Scholarship track updated successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const deleteScholarshipTrack = async (req, res) => {
    try {
        let id = req.params.id;
        let body = req.validateBody;
        let result = await scholarService.deleteScholarshipTrack(id, body);
        return sendResponse(res, 200, true, 'Delete scholarship track successfully', result);
    }catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const getAllScholarships = async (req, res) => {
    try {
        let result = await scholarService.getAllScholarshipsWithSubjects();
        return sendResponse(res, 200, true, 'Scholarships retrieved successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const getScholarship = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await scholarService.getScholarshipDetails(id);
        return sendResponse(res, 200, true, 'Scholarship retrieved successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const createScholarship = async (req, res) => {
    try {
        let result = await scholarService.createScholarshipWithSubjects(req.body);
        return sendResponse(res, 201, true, 'Scholarship created successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const updateScholarship = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await scholarService.updateScholarshipWithSubjects(id, req.body);
        return sendResponse(res, 200, true, 'Scholarship updated successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const deleteScholarship = async (req, res) => {
    try {
        let id = req.params.id;
        let result = await scholarService.deleteScholarshipEntry(id);
        return sendResponse(res, 200, true, 'Scholarship deleted successfully', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = {
    createScholarshipType,
    getScholarshipTypes,
    updateScholarshipType,
    deleteScholarshipType,
    createScholarshipSubject,
    getAllScholarshipSubjects,
    updateScholarshipSubject,
    deleteScholarshipSubject,
    createScholarshipTrack,
    getAllScholarshipTracks,
    updateScholarshipTrack,
    deleteScholarshipTrack,
    getAllScholarships,
    getScholarship,
    createScholarship,
    updateScholarship,
    deleteScholarship
}