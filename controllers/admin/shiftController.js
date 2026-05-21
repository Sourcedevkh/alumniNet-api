const shiftService = require('../../services/admin/shiftService');
const { sendResponse } = require("../../utils/responseHelper");

const getShift = async (req, res) => {
    try {
        let result = await  shiftService.getShift();
        return sendResponse(res, 200, 'Get shifts sucessed', result);
    }catch (error) {
        return sendResponse(res, 400, error.message);
    }
}

const createShift = async (req,res) => {
    try {
        const shift = await shiftService.create(req.body);
        return sendResponse(res, 200, 'Create shift success', shift);
    }catch (error) {
        return sendResponse(res, 400, error.message)
    }
}

const updateShift = async (req, res) => {
    try {
        const { id } = req.params;
        const shift = await shiftService.update(id, req.body);
        return sendResponse(res, 200, 'Update shift success', shift);
    } catch (error) {
        return sendResponse(res, 400, error.message);
    }
}

const deleteShift = async (req, res) => {
    try {
        const { id } = req.params;
        const shift = await shiftService.remove(id);
        return sendResponse(res, 200, 'Delete shift success', shift);
    } catch (error) {
        return sendResponse(res, 400, error.message);
    }
}

module.exports = {
    getShift,
    createShift,
    updateShift,
    deleteShift,
}