const classesService = require('../../services/admin/classesService');
const { sendResponse } = require('../../utils/responseHelper');

const findById = async (req, res) => {
    try {
        const data = await classesService.findById(req.params.id);
        return sendResponse(res, 200, true, 'Class retrieved successed', data);
    } catch (error) {
        return sendResponse(res, 404, false, error.message);
    }
}

const createClasses = async (req, res) => {
    try {
        const { name, description, generation_id, scholarship_id, shift_id } = req.validateBody;

        console.log({ name, generation_id, scholarship_id, shift_id });
        const newClassId = await classesService.createClasses({
            name,
            description,
            generation_id,
            scholarship_id,
            shift_id
        });

        return sendResponse(res, 201, true, 'Class created successed', { id: newClassId, name });
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const getClassbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await classesService.getClassWithRoster(id);
        return sendResponse(res, 200, true, 'Class retrieved successed', data);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const getAll = async (req, res) => {
    try {
        const classes = await classesService.getAllClasses();
        return sendResponse(res, 200, true, " Get classes fetched successed", classes);
    } catch (error) {
        return sendResponse(res, 500, false, error.message);
    }
};

const updateClass = async (req, res) => {
    try {
        let {id} = req.params;
        let body = req.body;
        let result = await classesService.updateClass(id, body);
        return sendResponse(res, 200, true, 'Class updated successed', result);
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

const archiveClass = async (req, res) => {
    try {
        let {id} = req.params;
        let {status} = req.validateBody;
        await classesService.archiveClass(id, status);
        return sendResponse(res, 200, true, 'Class archived successed');
    } catch (error) {
        return sendResponse(res, 400, false, error.message);
    }
}

module.exports = { 
    findById, 
    createClasses, 
    getClassbyId, 
    getAll,
    updateClass,
    archiveClass
};