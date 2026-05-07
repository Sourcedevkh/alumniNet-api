const Scholarship = require('../../models/admin/scholarship');

const getScholarships = async () => {
    let rows = await Scholarship.getScholar_types();

    return rows;
}

const createScholarshipType = async (body) => {

    if (!body.name) {
        throw new Error('Name is required');
    }
    let name = body.name.trim();
    let existing = await Scholarship.findScholarshipTypeByName(name);
    if (existing.length > 0) {
        throw new Error('Scholarship type already exists');
    }

    let result = await Scholarship.createScholarshipType({ name });
    return result;
}


const updateScholarshipType = async (id, body) => {
    if (!body.name) {
        throw new Error ('Name is required');
    }
    if (body.name.trim() === '') {
        throw new Error('Name Scholarship not found');
    }
    let name = body.name.trim();
    let existing = await Scholarship.findScholarshipTypeByName(name);
    if (existing.length > 0 && existing[0].id !== parseInt(id)) {
        throw new Error('Scholarship type already exists');
    }
    let result = await Scholarship.updateScholarshipType(id, { name });

    if (result.length === 0) {
        throw new Error('Scholarship type ID not found');
    }
    return result;
}

const deleteScholarshipType = async (id) => {
    let result = await Scholarship.deleteScholarshipType(id);
    if (result.affectedRows === 0) {
        throw new Error('Scholarship type ID not found');
    }
    return result[0];
}


const createScholarshipSubject = async (body) => {
    let { name, type_id } = body;
    if (!name || !type_id) {
        throw new Error('Name and type_id are required');
    }

     name = name.trim();
    if (name === '') {
        throw new Error('Scholarship subject name cannot be empty');
    }
    let type = await Scholarship.checkTypeIdExist(type_id);
    if (type.length === 0) {
        throw new Error('Scholarship type ID not found');
    }

    let result = await Scholarship.createScholarshipSubject({
        name,
        type_id
    });
    return {
        id: result.insertId,
        name,
        type_id
    };
};

const getAllScholarshipSubjects = async () => {
    let rows = await Scholarship.getAllScholarshipSubjects();
    
    return rows;
}
module.exports = {
    getScholarships,
    createScholarshipType,
    updateScholarshipType,
    deleteScholarshipType,
    createScholarshipSubject,
    getAllScholarshipSubjects
}