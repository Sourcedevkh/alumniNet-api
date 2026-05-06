const Scholarship = require('../../models/admin/scholarship');

const getScholarships = async () => {
    let rows = await User.getScholar_types();

    return rows;
}

const createScholarshipType = async (body) => {

    if (!body.name) {
        throw new Error('Name is required');
    }
    let name = body.name.trim();
    let existing = await User.findScholarshipTypeByName(name);
    if (existing.length > 0) {
        throw new Error('Scholarship type already exists');
    }

    let result = await User.createScholarshipType({ name });
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
    let existing = await User.findScholarshipTypeByName(name);
    if (existing.length > 0 && existing[0].id !== parseInt(id)) {
        throw new Error('Scholarship type already exists');
    }
    let result = await User.updateScholarshipType(id, { name });

    if (result.length === 0) {
        throw new Error('Scholarship type ID not found');
    }
    return result;
}

const deleteScholarshipType = async (id) => {
    let result = await User.deleteScholarshipType(id);
    if (result.affectedRows === 0) {
        throw new Error('Scholarship type ID not found');
    }
    return result[0];
}

module.exports = {
    getScholarships,
    createScholarshipType,
    updateScholarshipType,
    deleteScholarshipType
}