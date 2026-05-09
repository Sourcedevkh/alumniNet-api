const subjectService = require('../../services/admin/subjectService');
const { sendResponse } = require('../../utils/responseHelper');

const getAllSubjects = async (req, res) => {
  try {
    const result = await subjectService.getAllSubjects();
    return sendResponse(res, 200, true, 'Subjects retrieved successfully', result);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const getSubjectById = async (req, res) => {
  try {
    const result = await subjectService.getSubjectById(req.params.id);
    return sendResponse(res, 200, true, 'Subject retrieved successfully', result);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const createSubject = async (req, res) => {
  try {
    const result = await subjectService.createSubject(req.body);
    return sendResponse(res, 201, true, 'Subject created successfully', result);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const updateSubject = async (req, res) => {
  try {
    const result = await subjectService.updateSubject(req.params.id, req.body);
    return sendResponse(res, 200, true, 'Subject updated successfully', result);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

const deleteSubject = async (req, res) => {
  try {
    const result = await subjectService.deleteSubject(req.params.id);
    return sendResponse(res, 200, true, 'Subject deleted successfully', result);
  } catch (error) {
    return sendResponse(res, 400, false, error.message);
  }
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
};
